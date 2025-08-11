import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = "You are a supportive, non-clinical wellbeing coach. Communicate with warmth, validation, and gentle structure. Do: reflective listening, CBT/DBT-informed coping ideas, small actionable steps, and brief summaries. Don't: diagnose, claim you are a therapist, or give medical/legal advice. If user is in crisis or at risk, stop and show the CrisisSupport card. Keep replies ≤180 words, plain language, no jargon.";

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'self harm', 'cutting myself',
  'overdose', 'jumping', 'hanging', 'can\'t go on', 'no point living', 'better off dead',
  'harm myself', 'hurt myself', 'worthless', 'hopeless', 'end it all'
];

const DAILY_LIMITS = {
  guest: 5,
  user: 15
};

function detectCrisis(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

async function checkRateLimit(supabase: any, userId: string | null, isGuest: boolean): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];
  
  if (isGuest) {
    // For guests, we can't track across sessions, so we'll be lenient
    return true;
  }
  
  if (!userId) return false;
  
  const { data: todayMessages } = await supabase
    .from('messages')
    .select('id')
    .eq('created_at', today)
    .eq('sender', 'user');
    
  const messageCount = todayMessages?.length || 0;
  return messageCount < DAILY_LIMITS.user;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, userId } = await req.json();
    console.log('Chat request:', { sessionId, userId, message: message.substring(0, 100) });

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Check for crisis keywords
    if (detectCrisis(message)) {
      console.log('Crisis detected in message');
      return new Response(
        JSON.stringify({ 
          crisis: true, 
          message: "I notice you might be going through a really difficult time. Your safety and wellbeing are important. Please reach out to a crisis helpline or emergency services immediately." 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Rate limiting
    const isGuest = !userId;
    const canSend = await checkRateLimit(supabase, userId, isGuest);
    if (!canSend) {
      return new Response(
        JSON.stringify({ error: 'Daily message limit reached. Please try again tomorrow.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429 
        }
      );
    }

    // Save user message to database (if not guest)
    if (!isGuest && userId && sessionId) {
      await supabase
        .from('messages')
        .insert({
          session_id: sessionId,
          content: message,
          sender: 'user'
        });
    }

    // Get conversation history (last 20 messages)
    let conversationHistory = [];
    if (!isGuest && sessionId) {
      const { data: messages } = await supabase
        .from('messages')
        .select('content, sender, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (messages) {
        conversationHistory = messages.reverse().map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
      }
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('Sending to OpenAI with', messages.length, 'messages');

    // Call OpenAI API with streaming
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 600, // ~180 words
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // Create readable stream for the response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let fullResponse = '';
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader available');

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  // Save AI response to database (if not guest)
                  if (!isGuest && userId && sessionId && fullResponse) {
                    await supabase
                      .from('messages')
                      .insert({
                        session_id: sessionId,
                        content: fullResponse,
                        sender: 'ai'
                      });
                  }
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    fullResponse += content;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  console.log('Error parsing chunk:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
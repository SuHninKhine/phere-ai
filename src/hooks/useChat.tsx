import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  started_at: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createSession = useCallback(async (): Promise<string> => {
    if (!user) {
      // Guest session - generate temporary ID
      const guestSessionId = `guest-${Date.now()}`;
      setCurrentSession({
        id: guestSessionId,
        title: 'Guest Session',
        started_at: new Date().toISOString()
      });
      return guestSessionId;
    }

    // Logged-in user - create session in database
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        session_title: `Session ${new Date().toLocaleDateString()}`,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create chat session",
        variant: "destructive"
      });
      throw error;
    }

      setCurrentSession({
        id: data.id,
        title: data.session_title,
        started_at: data.started_at
      });
      return data.id;
  }, [user, toast]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setIsStreaming(true);

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Create session if needed
      let sessionId = currentSession?.id;
      if (!sessionId) {
        sessionId = await createSession();
      }

      // Call chat API
      const response = await fetch(`https://ljlqqijsxrrbcerdqvbc.functions.supabase.co/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user ? (await supabase.auth.getSession()).data.session?.access_token : ''}`,
        },
        body: JSON.stringify({
          message: content,
          sessionId: sessionId,
          userId: user?.id || null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if it's a crisis response
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        if (data.crisis) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: data.message,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsLoading(false);
          setIsStreaming(false);
          return;
        }
        if (data.error) {
          throw new Error(data.error);
        }
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let aiContent = '';
      const aiMessageId = (Date.now() + 1).toString();

      // Add empty AI message that will be updated
      setMessages(prev => [...prev, {
        id: aiMessageId,
        content: '',
        sender: 'ai',
        timestamp: new Date()
      }]);

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                aiContent += data.content;
                // Update the AI message content
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId 
                    ? { ...msg, content: aiContent }
                    : msg
                ));
              }
            } catch (e) {
              console.log('Error parsing streaming data:', e);
            }
          }
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      });
      
      // Remove user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [currentSession, user, isLoading, createSession, toast]);

  const startNewSession = useCallback(async () => {
    setMessages([]);
    setCurrentSession(null);
    
    // Send initial greeting
    const greeting = "Hello! I'm here to listen and support you. How are you feeling today? What's on your mind?";
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: greeting,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([aiMessage]);
    
    // Create the session
    await createSession();
  }, [createSession]);

  return {
    messages,
    currentSession,
    isLoading,
    isStreaming,
    sendMessage,
    startNewSession
  };
};
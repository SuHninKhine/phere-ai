import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Square, RotateCcw } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { CrisisSupport } from "./CrisisSupport";
import { useState } from "react";

export const ChatInterface = ({ autoStart = false }: { autoStart?: boolean }) => {
  const [inputValue, setInputValue] = useState("");
  const { messages, isLoading, isStreaming, sendMessage, startNewSession } = useChat();
  const { user } = useAuth();

  useEffect(() => {
    if (autoStart) {
      startNewSession();
    }
  }, [autoStart, startNewSession]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section id="chat" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {!autoStart && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Start Your Conversation
              </h2>
              <p className="text-muted-foreground mb-6">
                {user ? "Your AI wellbeing coach is ready to listen and support you." : "Chat as a guest or sign in to save your conversations."}
              </p>
              <Button 
                onClick={startNewSession}
                size="lg"
                className="mb-4"
              >
                Start Your First Session
              </Button>
            </div>
          )}

          {messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Click "Start Your First Session" to begin your conversation</p>
            </div>
          )}

          <Card className="shadow-gentle border-0 bg-card/80 backdrop-blur-sm">
            <div className="p-6">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto mb-6 space-y-4 bg-background/50 rounded-xl p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-primary text-primary-foreground'
                          : 'bg-accent text-accent-foreground'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>

                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Show crisis support if last message indicates crisis */}
              {messages.length > 0 && messages[messages.length - 1].content.includes("crisis helpline") && (
                <CrisisSupport />
              )}

              {/* Input Area */}
              <div className="space-y-3">
                <div className="flex items-end space-x-2">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind..."
                    className="flex-1 border-border/50 bg-background/80 rounded-xl min-h-[50px] max-h-[120px] resize-none"
                    rows={2}
                  />
                  <div className="flex flex-col space-y-1">
                    {isStreaming && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => window.location.reload()}
                      >
                        <Square className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      className="rounded-xl"
                      disabled={!inputValue.trim() || isLoading}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {user ? "Your conversations are saved securely" : "Guest mode - conversations not saved"}
                  </span>
                  <span>
                    {inputValue.length}/500 characters
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MoodTracker } from "@/components/MoodTracker";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        
        {/* Chat Preview Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Experience AI-Powered Wellbeing Support
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Get personalized, empathetic responses from our AI companion trained in therapeutic techniques
              </p>
              
              <Card className="p-8 mb-8 bg-background/80 backdrop-blur-sm">
                <div className="space-y-4 text-left max-w-2xl mx-auto">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 flex-1">
                      <p className="text-sm text-muted-foreground">You</p>
                      <p className="text-foreground">I've been feeling really overwhelmed lately with work and life...</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 flex-1">
                      <p className="text-sm text-primary">AI Companion</p>
                      <p className="text-foreground">I hear that you're feeling overwhelmed, and that sounds really challenging. It's completely understandable to feel this way when juggling multiple responsibilities. Let's take this step by step - what feels like the most pressing thing on your mind right now?</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-auto"
                onClick={() => navigate('/chat')}
              >
                Start Your Conversation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>
        
        <MoodTracker />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

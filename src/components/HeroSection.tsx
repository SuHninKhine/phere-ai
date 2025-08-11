import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Clock, Heart } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { useChat } from "@/hooks/useChat";

export const HeroSection = () => {
  const { startNewSession } = useChat();
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-calm">
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-accent/50 rounded-full px-4 py-2 mb-6">
              <Heart className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm text-accent-foreground">Professional AI Counseling</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Personal AI
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Counselor & Companion
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Get immediate, private emotional support with AI-powered therapeutic conversations. 
              Available 24/7 for when you need someone to listen, understand, and guide you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Button 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={() => {
                startNewSession();
                document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Your First Session
            </Button>
            <Button variant="calm" size="lg" className="w-full sm:w-auto">
              Learn How It Works
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-card rounded-2xl shadow-soft">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">Private & Secure</h3>
              <p className="text-sm text-muted-foreground text-center">
                Your conversations are encrypted and completely confidential
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-card rounded-2xl shadow-soft">
              <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">Available 24/7</h3>
              <p className="text-sm text-muted-foreground text-center">
                Get support whenever you need it, day or night
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-card rounded-2xl shadow-soft">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">Evidence-Based</h3>
              <p className="text-sm text-muted-foreground text-center">
                Trained on real counselor protocols and therapeutic techniques
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
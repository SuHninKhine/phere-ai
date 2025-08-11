import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            TherapistAI Companion
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#chat" className="text-muted-foreground hover:text-foreground transition-colors">
            Start chatting
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="therapeutic" size="sm">
            Sign In
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="hidden sm:flex"
            onClick={() => navigate('/chat')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Chat
          </Button>
        </div>
      </div>
    </header>
  );
};
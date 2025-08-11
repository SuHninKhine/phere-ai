import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ChatInterface } from "@/components/ChatInterface";
import { MoodTracker } from "@/components/MoodTracker";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ChatInterface />
        <MoodTracker />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

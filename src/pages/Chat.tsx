import { Header } from "@/components/Header";
import { ChatInterface } from "@/components/ChatInterface";
import { Footer } from "@/components/Footer";

const Chat = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              AI Wellbeing Companion
            </h1>
            <p className="text-muted-foreground text-lg">
              Start a conversation with your supportive AI companion
            </p>
          </div>
          <ChatInterface autoStart={true} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
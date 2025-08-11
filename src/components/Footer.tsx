import { Heart, Shield, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  TherapistAI Companion
                </h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Professional AI counseling available 24/7. 
                Your mental health matters.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy & Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Crisis Resources
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Emergency Help</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 bg-accent/30 rounded-lg">
                  <Phone className="w-4 h-4 text-accent-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Crisis Hotline</p>
                    <p className="text-xs text-muted-foreground">988 (US)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-accent/30 rounded-lg">
                  <Shield className="w-4 h-4 text-accent-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Emergency</p>
                    <p className="text-xs text-muted-foreground">Call 911</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 TherapistAI Companion. This AI companion supplements but does not replace professional therapy.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
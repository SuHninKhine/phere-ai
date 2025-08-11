import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Heart, AlertTriangle } from "lucide-react";

export const CrisisSupport = () => {
  return (
    <Card className="border-2 border-destructive/50 bg-destructive/5 p-6 my-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-destructive mb-2">
              Immediate Support Available
            </h3>
            <p className="text-sm text-foreground/80 mb-4">
              If you're experiencing thoughts of self-harm or suicide, please reach out for immediate help. You're not alone.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-background/50 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Singapore Crisis Hotlines
              </h4>
              <ul className="text-sm space-y-1 text-foreground/70">
                <li>• Samaritans of Singapore: <strong>1767</strong></li>
                <li>• Institute of Mental Health: <strong>6389 2222</strong></li>
                <li>• Singapore Association for Mental Health: <strong>1800 283 7019</strong></li>
              </ul>
            </div>
            
            <div className="bg-background/50 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2 flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                International Support
              </h4>
              <ul className="text-sm space-y-1 text-foreground/70">
                <li>• US: National Suicide Prevention Lifeline <strong>988</strong></li>
                <li>• UK: Samaritans <strong>116 123</strong></li>
                <li>• Australia: Lifeline <strong>13 11 14</strong></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => window.open('tel:1767', '_self')}
            >
              Call Samaritans (1767)
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://www.sos.org.sg/', '_blank')}
            >
              Visit SOS Website
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            If this is a medical emergency, please call emergency services (995 in Singapore) immediately.
          </p>
        </div>
      </div>
    </Card>
  );
};
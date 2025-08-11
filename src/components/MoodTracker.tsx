import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smile, Meh, Frown, Heart, Star } from "lucide-react";

const moods = [
  { icon: Smile, label: "Great", value: 5, color: "text-green-500" },
  { icon: Star, label: "Good", value: 4, color: "text-blue-500" },
  { icon: Meh, label: "Okay", value: 3, color: "text-yellow-500" },
  { icon: Heart, label: "Low", value: 2, color: "text-orange-500" },
  { icon: Frown, label: "Struggling", value: 1, color: "text-red-500" },
];

export const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleMoodSubmit = () => {
    if (selectedMood) {
      setIsSubmitted(true);
      // In real implementation, this would save to database
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedMood(null);
      }, 3000);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How are you feeling today?
          </h2>
          <p className="text-muted-foreground mb-8">
            Track your mood to better understand your emotional patterns over time.
          </p>

          <Card className="p-8 shadow-gentle bg-gradient-calm border-0">
            {!isSubmitted ? (
              <>
                <div className="grid grid-cols-5 gap-4 mb-8">
                  {moods.map((mood) => {
                    const IconComponent = mood.icon;
                    return (
                      <button
                        key={mood.value}
                        onClick={() => setSelectedMood(mood.value)}
                        className={`p-4 rounded-2xl transition-all hover:scale-110 ${
                          selectedMood === mood.value
                            ? 'bg-primary text-primary-foreground shadow-soft'
                            : 'bg-background hover:bg-accent'
                        }`}
                      >
                        <IconComponent className={`w-8 h-8 mx-auto mb-2 ${
                          selectedMood === mood.value ? '' : mood.color
                        }`} />
                        <p className="text-sm font-medium">{mood.label}</p>
                      </button>
                    );
                  })}
                </div>

                <Button
                  onClick={handleMoodSubmit}
                  disabled={!selectedMood}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Log My Mood
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Thank you for sharing
                </h3>
                <p className="text-muted-foreground">
                  Your mood has been logged. Remember, every feeling is valid.
                </p>
              </div>
            )}
          </Card>

          <p className="text-sm text-muted-foreground mt-4">
            Connect to Supabase to save your mood history and track patterns over time.
          </p>
        </div>
      </div>
    </section>
  );
};
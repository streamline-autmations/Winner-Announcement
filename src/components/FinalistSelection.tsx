import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Entrant } from "@/services/airtable";
import { RecklessBearLogo } from "./RecklessBearLogo";
import { Users, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinalistSelectionProps {
  entrants: Entrant[];
  finalists: Entrant[];
  onSelectNext: () => void;
  onProceed: () => void;
  isSelecting: boolean;
  selectionTarget: Entrant | null;
  onAnimationComplete: (selected: Entrant) => void;
}

const FinalistSelection = ({ entrants, finalists, onSelectNext, onProceed, isSelecting, selectionTarget, onAnimationComplete }: FinalistSelectionProps) => {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [celebratedId, setCelebratedId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!selectionTarget || entrants.length === 0) return;

    setCelebratedId(null); // Reset celebration on new selection
    let timeoutId: NodeJS.Timeout;
    const targetIndex = entrants.findIndex(e => e.id === selectionTarget.id);
    if (targetIndex === -1) return;

    // Animation parameters
    const spins = 2;
    const totalItems = entrants.length;
    const totalSteps = (totalItems * spins) + targetIndex;
    let currentStep = 0;

    const step = () => {
      const currentIndex = currentStep % totalItems;
      const currentEntrant = entrants[currentIndex];
      setHighlightedId(currentEntrant.id);

      const element = listRef.current?.children[currentIndex] as HTMLElement;
      if (element) {
        // Use 'instant' to avoid conflicting with our animation timing
        element.scrollIntoView({ behavior: 'instant', block: 'center' });
      }

      currentStep++;

      if (currentStep > totalSteps) {
        // Animation finished, start celebration
        setHighlightedId(selectionTarget.id); // Ensure the final one is highlighted
        setCelebratedId(selectionTarget.id);

        // Wait for celebration to finish, then notify parent
        setTimeout(() => {
          onAnimationComplete(selectionTarget);
        }, 1500); // Match celebration animation duration
        return;
      }

      // Smoother ease-out timing
      const progress = currentStep / totalSteps;
      const baseDelay = 2; // Start faster
      const slowdownFactor = 15; // Adjust for a faster overall animation
      const delay = baseDelay + (Math.pow(progress, 3) * slowdownFactor); // Use cubic easing for a smoother curve

      timeoutId = setTimeout(step, delay);
    };

    step();

    return () => clearTimeout(timeoutId);
  }, [selectionTarget, entrants, onAnimationComplete]);

  const canSelectMore = finalists.length < 5;

  return (
    <div className="w-full max-w-6xl mx-auto text-center animate-fade-in">
      <RecklessBearLogo />
      <h1 className="text-5xl font-brand my-6 text-glow-gold">FINALIST SELECTION</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main participant list takes up more space now */}
        <Card className="md:col-span-2 bg-black/30 border-zinc-700">
          <CardHeader>
            <CardTitle className="font-brand text-2xl tracking-wider flex items-center justify-center gap-2">
              <Users /> Participants ({entrants.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto pr-4">
            <ul ref={listRef} className="space-y-1 text-left">
              {entrants.map((entrant) => (
                <li 
                  key={entrant.id} 
                  className={cn(
                    "p-2 rounded-md transition-all duration-100 text-lg",
                    highlightedId === entrant.id && "bg-primary text-primary-foreground scale-105 font-bold",
                    celebratedId === entrant.id && "animate-celebrate"
                  )}
                >
                  {entrant.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Finalists list */}
        <Card className="md:col-span-1 bg-black/30 border-yellow-500/50">
          <CardHeader>
            <CardTitle className="font-brand text-2xl tracking-wider flex items-center justify-center gap-2 text-glow-gold">
              <Crown /> Finalists ({finalists.length}/5)
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto">
            <ul className="space-y-3 text-left text-lg">
              {finalists.map((finalist) => (
                <li key={finalist.id} className="font-bold animate-fade-in">
                  {finalist.name}
                </li>
              ))}
              {Array.from({ length: 5 - finalists.length }).map((_, i) => (
                <li key={`placeholder-${i}`} className="text-zinc-600">
                  Awaiting selection...
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        {canSelectMore ? (
          <Button onClick={onSelectNext} className="button-brand" disabled={isSelecting || entrants.length === 0}>
            {isSelecting ? 'SELECTING...' : 'SELECT NEXT FINALIST'}
          </Button>
        ) : (
          <Button onClick={onProceed} className="button-brand">
            PROCEED TO GAUNTLET
          </Button>
        )}
      </div>
    </div>
  );
};

export default FinalistSelection;
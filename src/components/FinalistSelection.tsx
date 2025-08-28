import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Entrant } from "@/services/airtable";
import { Users, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import ConfettiCannon from "./ConfettiCannon";

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
  const [showConfetti, setShowConfetti] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!selectionTarget || entrants.length === 0) return;

    setCelebratedId(null);
    let animationFrameId: number;

    const targetIndex = entrants.findIndex(e => e.id === selectionTarget.id);
    if (targetIndex === -1) return;

    // Add variation to the animation
    const spins = Math.random() > 0.5 ? 2 : 1;
    const easingPower = 5 + Math.random() * 2; // A power between 5 and 7 for a very dramatic slowdown
    const totalItems = entrants.length;
    const totalSteps = (totalItems * spins) + targetIndex;
    
    const DURATION = 8000; // 8 seconds total animation time
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / DURATION, 1);

      // A powerful "ease-out" function: starts very fast, ends very slow.
      const easedProgress = 1 - Math.pow(1 - progress, easingPower);

      const currentVirtualStep = Math.floor(easedProgress * totalSteps);
      const currentIndex = currentVirtualStep % totalItems;
      const currentEntrant = entrants[currentIndex];
      
      if (currentEntrant) {
        setHighlightedId(currentEntrant.id);
        const element = listRef.current?.children[currentIndex] as HTMLElement;
        if (element) {
          element.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Animation finished, ensure the correct finalist is selected
        setHighlightedId(selectionTarget.id);
        const finalElement = listRef.current?.children[targetIndex] as HTMLElement;
        if (finalElement) {
            finalElement.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
        setCelebratedId(selectionTarget.id);
        setShowConfetti(true);

        setTimeout(() => {
          onAnimationComplete(selectionTarget);
        }, 1500);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [selectionTarget, entrants, onAnimationComplete]);

  const canSelectMore = finalists.length < 5;

  return (
    <div className="w-full max-w-6xl mx-auto text-center animate-fade-in">
      <ConfettiCannon fire={showConfetti} onComplete={() => setShowConfetti(false)} />
      <h1 className="text-5xl font-brand my-6 text-glow-gold">FINALIST SELECTION</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="md:col-span-3 bg-black/30 border-zinc-700">
          <CardHeader>
            <CardTitle className="font-brand text-2xl tracking-wider flex items-center justify-center gap-2">
              <Users /> Participants
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
            PROCEED TO WHEELSPIN
          </Button>
        )}
      </div>
    </div>
  );
};

export default FinalistSelection;
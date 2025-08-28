import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Entrant } from "@/services/airtable";
import { RecklessBearLogo } from "./RecklessBearLogo";
import { Users, Crown } from "lucide-react";

interface ArenaProps {
  entrants: Entrant[];
  finalists: Entrant[];
  onSelectNext: () => void;
  onProceed: () => void;
  isSelecting: boolean;
}

const Arena = ({ entrants, finalists, onSelectNext, onProceed, isSelecting }: ArenaProps) => {
  const canSelectMore = finalists.length < 5;

  return (
    <div className="w-full max-w-6xl mx-auto text-center animate-fade-in">
      <RecklessBearLogo />
      <h1 className="text-5xl font-brand my-6 text-glow-gold">THE ARENA</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-black/30 border-zinc-700">
          <CardHeader>
            <CardTitle className="font-brand text-2xl tracking-wider flex items-center justify-center gap-2">
              <Users /> Participants ({entrants.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[40vh] overflow-y-auto">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-left">
              {entrants.map((entrant) => (
                <li key={entrant.id} className="truncate">
                  {entrant.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-yellow-500/50">
          <CardHeader>
            <CardTitle className="font-brand text-2xl tracking-wider flex items-center justify-center gap-2 text-glow-gold">
              <Crown /> Finalists ({finalists.length}/5)
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[40vh] overflow-y-auto">
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

export default Arena;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Entrant } from "@/data/mockData";
import { RecklessBearLogo } from "./RecklessBearLogo";

interface ArenaProps {
  entrants: Entrant[];
  onStartDraw: () => void;
}

const Arena = ({ entrants, onStartDraw }: ArenaProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto text-center animate-fade-in">
      <RecklessBearLogo />
      <h1 className="text-5xl font-brand my-6 text-glow-gold">THE ARENA</h1>
      
      <Card className="bg-black/30 border-zinc-700 max-h-[50vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="font-brand text-2xl tracking-wider">All Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 text-left">
            {entrants.map((entrant) => (
              <li key={entrant.id} className="truncate">
                {entrant.name}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-12">
        <Button onClick={onStartDraw} className="button-brand">
          UNLEASH THE DRAW
        </Button>
      </div>
    </div>
  );
};

export default Arena;
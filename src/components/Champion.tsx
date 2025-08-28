import { Entrant } from "@/services/airtable";
import { RecklessBearLogo } from "./RecklessBearLogo";
import { Button } from "./ui/button";

interface ChampionProps {
  winner: Entrant | null;
  onSave: () => void;
  isSaving: boolean;
}

const Champion = ({ winner, onSave, isSaving }: ChampionProps) => {
  if (!winner) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto text-center animate-fade-in flex flex-col items-center">
      <div className="absolute -top-20 -inset-x-0 h-[100vh] bg-[url('https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExb255a254a254a254a254a254a254a254a254a254/l41Yg3wbEY235w9Tq/giphy.gif')] bg-contain bg-no-repeat opacity-50 mix-blend-screen"></div>
      
      <RecklessBearLogo size={120} />
      
      <h1 className="text-7xl font-brand my-8 text-glow-gold z-10">WE HAVE A WINNER!</h1>
      
      <div className="bg-black/50 border-2 border-yellow-500 rounded-lg p-8 z-10">
        <p className="text-2xl font-brand">CONGRATULATIONS,</p>
        <p className="text-6xl font-brand text-glow-gold my-4">{winner.name}</p>
      </div>

      <div className="mt-12 z-10">
        <div className="bg-yellow-500 text-black p-6 rounded-lg">
          <p className="text-4xl font-brand">R10 000 CASH PRIZE</p>
        </div>
      </div>

      <div className="mt-12 z-10">
        <Button onClick={onSave} disabled={isSaving} className="button-brand">
          {isSaving ? 'SAVING...' : 'SAVE RESULTS TO AIRTABLE'}
        </Button>
      </div>
    </div>
  );
};

export default Champion;
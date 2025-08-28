import { useState } from "react";
import { Entrant } from "@/services/airtable";
import { Button } from "@/components/ui/button";
import RouletteWheel from "./RouletteWheel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import WinnerModal from "./WinnerModal";

interface WheelspinProps {
  finalists: Entrant[];
  onEliminate: (eliminated: Entrant) => void;
  winner: Entrant | null;
  onCloseWinnerModal: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const Wheelspin = ({ finalists, onEliminate, winner, onCloseWinnerModal, onSave, isSaving }: WheelspinProps) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const remainingFinalists = finalists.filter(f => f.status === 'Finalist');

  const handleSpinClick = () => {
    if (!mustSpin && remainingFinalists.length > 1) {
      const newPrizeNumber = Math.floor(Math.random() * remainingFinalists.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleSpinEnd = () => {
    setMustSpin(false);
    const eliminatedPerson = remainingFinalists[prizeNumber];
    onEliminate(eliminatedPerson);
  };

  return (
    <div className="w-full max-w-6xl mx-auto text-center animate-fade-in">
      <WinnerModal winner={winner} onClose={onCloseWinnerModal} />
      <h1 className="text-5xl font-brand mt-24 mb-8 title-brand">THE WHEELSPIN</h1>
      <h2 className="text-2xl font-brand mb-8">{remainingFinalists.length} FINALISTS REMAIN</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <Card className="md:col-span-1 bg-card border-zinc-700/50 rounded-lg text-left">
          <CardHeader>
            <CardTitle className="font-brand text-2xl tracking-wider flex items-center justify-center gap-2">
              <Users /> Finalists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-xl">
              {finalists.map(f => (
                <li key={f.id} className={`transition-opacity duration-500 ${f.status === 'Eliminated' ? 'opacity-30' : 'opacity-100'}`}>
                  {f.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <div className="relative md:col-span-2 flex flex-col items-center">
          <RouletteWheel
            finalists={remainingFinalists}
            mustSpin={mustSpin}
            prizeNumber={prizeNumber}
            onSpinEnd={handleSpinEnd}
          />
          
          <div className="mt-8">
            {remainingFinalists.length > 1 ? (
              <Button onClick={handleSpinClick} className="button-brand" disabled={mustSpin}>
                {mustSpin ? 'SPINNING...' : 'SPIN TO ELIMINATE'}
              </Button>
            ) : (
              <Button onClick={onSave} className="button-brand" disabled={isSaving}>
                {isSaving ? 'SAVING...' : 'SAVE RESULTS'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wheelspin;
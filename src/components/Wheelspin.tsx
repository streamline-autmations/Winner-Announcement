import { useState } from "react";
import { Entrant } from "@/services/airtable";
import { Button } from "@/components/ui/button";
import CustomWheel from "./CustomWheel";

interface WheelspinProps {
  finalists: Entrant[];
  onEliminate: (eliminated: Entrant) => void;
}

const Wheelspin = ({ finalists, onEliminate }: WheelspinProps) => {
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
      <h1 className="text-5xl font-brand my-6 text-glow-gold">THE WHEELSPIN</h1>
      <h2 className="text-2xl font-brand mb-8">{remainingFinalists.length} FINALISTS REMAIN</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1">
          <ul className="space-y-2 text-xl text-left">
            {finalists.map(f => (
              <li key={f.id} className={`transition-all duration-500 ${f.status === 'Eliminated' ? 'opacity-40' : 'opacity-100'}`}>
                {f.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative md:col-span-2 flex flex-col items-center">
          <CustomWheel
            finalists={remainingFinalists}
            mustSpin={mustSpin}
            prizeNumber={prizeNumber}
            onSpinEnd={handleSpinEnd}
          />
          
          <Button onClick={handleSpinClick} className="button-brand mt-8" disabled={mustSpin || remainingFinalists.length <= 1}>
            {mustSpin ? 'SPINNING...' : 'SPIN TO ELIMINATE'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wheelspin;
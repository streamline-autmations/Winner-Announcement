import { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import { Entrant } from "@/services/airtable";
import { Button } from "@/components/ui/button";
import { RecklessBearLogo } from "./RecklessBearLogo";

interface GauntletProps {
  finalists: Entrant[];
  onDrawComplete: (winner: Entrant) => void;
}

const Gauntlet = ({ finalists, onDrawComplete }: GauntletProps) => {
  const [internalFinalists, setInternalFinalists] = useState(finalists);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const remainingFinalists = internalFinalists.filter(f => f.status !== 'Eliminated');
  const wheelData = remainingFinalists.map(f => ({ option: f.name.split(' ')[0] }));

  useEffect(() => {
    if (remainingFinalists.length === 1) {
      const timer = setTimeout(() => onDrawComplete(remainingFinalists[0]), 2000);
      return () => clearTimeout(timer);
    }
  }, [internalFinalists, onDrawComplete, remainingFinalists]);

  const handleSpinClick = () => {
    if (!mustSpin && wheelData.length > 1) {
      const newPrizeNumber = Math.floor(Math.random() * wheelData.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const onStopSpinning = () => {
    setMustSpin(false);
    const eliminatedPerson = remainingFinalists[prizeNumber];
    setInternalFinalists(prev =>
      prev.map(f =>
        f.id === eliminatedPerson.id ? { ...f, status: 'Eliminated' } : f
      )
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto text-center animate-fade-in">
      <RecklessBearLogo />
      <h1 className="text-5xl font-brand my-6 text-glow-gold">THE GAUNTLET</h1>
      <h2 className="text-2xl font-brand mb-8">{remainingFinalists.length} FINALISTS REMAIN</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1">
          <ul className="space-y-2 text-xl text-left">
            {internalFinalists.map(f => (
              <li key={f.id} className={`transition-all duration-500 ${f.status === 'Eliminated' ? 'text-zinc-500 line-through decoration-red-500 decoration-2' : ''}`}>
                {f.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2 flex flex-col items-center">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={wheelData}
            onStopSpinning={onStopSpinning}
            backgroundColors={['#11100f', '#333333']}
            textColors={['#FFFFFF']}
            outerBorderColor={"#FFD700"}
            outerBorderWidth={5}
            innerBorderColor={"#FFD700"}
            innerBorderWidth={10}
            radiusLineColor={"#FFD700"}
            radiusLineWidth={2}
            fontSize={20}
            textDistance={75}
            spinDuration={0.5}
          />
          <Button onClick={handleSpinClick} className="button-brand mt-8" disabled={mustSpin || remainingFinalists.length <= 1}>
            {mustSpin ? 'SPINNING...' : 'SPIN TO ELIMINATE'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Gauntlet;
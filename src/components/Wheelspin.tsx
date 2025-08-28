import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { Entrant } from "@/services/airtable";
import { Button } from "@/components/ui/button";
import { RecklessBearLogo } from "./RecklessBearLogo";

interface WheelspinProps {
  finalists: Entrant[];
  onEliminate: (eliminated: Entrant) => void;
}

const Wheelspin = ({ finalists, onEliminate }: WheelspinProps) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const remainingFinalists = finalists.filter(f => f.status === 'Finalist');
  const wheelData = remainingFinalists.map(f => ({ option: f.name.split(' ')[0] || f.name }));

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
    onEliminate(eliminatedPerson);
  };

  return (
    <div className="w-full max-w-6xl mx-auto text-center animate-fade-in">
      <RecklessBearLogo />
      <h1 className="text-5xl font-brand my-6 text-glow-gold">THE WHEELSPIN</h1>
      <h2 className="text-2xl font-brand mb-8">{remainingFinalists.length} FINALISTS REMAIN</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1">
          <ul className="space-y-2 text-xl text-left">
            {finalists.map(f => (
              <li key={f.id} className={`transition-all duration-500 ${f.status === 'Eliminated' ? 'text-zinc-500 line-through decoration-red-500 decoration-2' : ''}`}>
                {f.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative md:col-span-2 flex flex-col items-center">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
            <div 
              className="w-0 h-0 
                border-l-[25px] border-l-transparent
                border-r-[25px] border-r-transparent
                border-t-[40px] border-t-secondary"
              style={{ filter: 'drop-shadow(0 6px 4px rgba(0,0,0,0.6))' }}
            />
            <div className="w-6 h-6 bg-secondary rounded-full -mt-3 border-4 border-yellow-700"></div>
          </div>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={wheelData}
            onStopSpinning={onStopSpinning}
            backgroundColors={['#991B1B', '#B45309']}
            textColors={['#FFFFFF']}
            outerBorderColor={"hsl(var(--secondary))"}
            outerBorderWidth={15}
            innerBorderColor={"hsl(var(--primary))"}
            innerBorderWidth={20}
            radiusLineColor={"hsl(var(--secondary))"}
            radiusLineWidth={5}
            fontSize={20}
            textDistance={75}
            spinDuration={10.0}
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
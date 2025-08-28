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
          {/* Custom Pointer */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-[50px] h-[60px]" style={{ filter: 'drop-shadow(0 6px 4px rgba(0,0,0,0.6))' }}>
            <div className="w-full h-full bg-zinc-900 [clip-path:polygon(0%_0%,_100%_0%,_50%_100%)]"></div>
            <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[20px] h-[20px] bg-primary [clip-path:polygon(50%_0%,_0%_100%,_100%_100%)]"></div>
          </div>

          <div className="relative flex items-center justify-center">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={wheelData}
              onStopSpinning={onStopSpinning}
              backgroundColors={['#1C1C1C', '#991B1B']}
              textColors={['#FFFFFF']}
              outerBorderColor={"#D4AF37"}
              outerBorderWidth={15}
              innerBorderWidth={0}
              radiusLineColor={"#D4AF37"}
              radiusLineWidth={3}
              fontSize={18}
              fontWeight="bold"
              textDistance={70}
              spinDuration={10.0}
            />
            {/* Centerpiece */}
            <div className="absolute w-[120px] h-[120px] bg-zinc-900 rounded-full border-8 border-[#D4AF37] flex items-center justify-center">
              <RecklessBearLogo size={60} />
            </div>
          </div>
          
          <Button onClick={handleSpinClick} className="button-brand mt-8" disabled={mustSpin || remainingFinalists.length <= 1}>
            {mustSpin ? 'SPINNING...' : 'SPIN TO ELIMINATE'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wheelspin;
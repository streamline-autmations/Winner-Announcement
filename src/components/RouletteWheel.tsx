import { Wheel } from 'react-custom-roulette';
import { Entrant } from '@/services/airtable';

interface RouletteWheelProps {
  finalists: Entrant[];
  mustSpin: boolean;
  prizeNumber: number;
  onSpinEnd: () => void;
}

const backgroundColors = ['#B91C1C', '#F59E0B']; // Red, Gold
const textColors = ['#FFFFFF', '#1E1B18']; // White, Dark Grey

const RouletteWheel = ({ finalists, mustSpin, prizeNumber, onSpinEnd }: RouletteWheelProps) => {
  const wheelData = finalists.map((finalist, i) => ({
    option: finalist.name.length > 15 ? finalist.name.substring(0, 15) + '...' : finalist.name,
    style: {
      backgroundColor: backgroundColors[i % 2],
      textColor: textColors[i % 2],
    },
  }));

  return (
    <div className="relative flex items-center justify-center">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={wheelData}
        onStopSpinning={onSpinEnd}
        outerBorderColor={"#444444"}
        outerBorderWidth={10}
        innerBorderColor={"#444444"}
        innerBorderWidth={10}
        radiusLineColor={"#444444"}
        radiusLineWidth={2}
        fontSize={14}
        fontWeight={700}
        textDistance={75}
        spinDuration={0.5}
      />
    </div>
  );
};

export default RouletteWheel;
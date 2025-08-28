import { useState } from "react";
import { mockEntrants, Entrant } from "@/data/mockData";
import Arena from "@/components/Arena";
import Selection from "@/components/Selection";
import Gauntlet from "@/components/Gauntlet";
import Champion from "@/components/Champion";

type DrawStep = 'arena' | 'selection' | 'gauntlet' | 'champion';

const Index = () => {
  const [step, setStep] = useState<DrawStep>('arena');
  const [allEntrants] = useState(mockEntrants.filter(e => e.status === 'Entrant'));
  const [finalists, setFinalists] = useState<Entrant[]>([]);
  const [winner, setWinner] = useState<Entrant | null>(null);

  const handleStartDraw = () => {
    const shuffled = [...allEntrants].sort(() => 0.5 - Math.random());
    const selectedFinalists = shuffled.slice(0, 5).map(f => ({...f, status: 'Finalist'}));
    setFinalists(selectedFinalists);
    setStep('selection');
  };

  const handleAnimationEnd = () => {
    setStep('gauntlet');
  };

  const handleDrawComplete = (winner: Entrant) => {
    setWinner(winner);
    setStep('champion');
  };

  const renderStep = () => {
    switch (step) {
      case 'arena':
        return <Arena entrants={allEntrants} onStartDraw={handleStartDraw} />;
      case 'selection':
        return <Selection onAnimationEnd={handleAnimationEnd} />;
      case 'gauntlet':
        return <Gauntlet finalists={finalists} onDrawComplete={handleDrawComplete} />;
      case 'champion':
        return <Champion winner={winner} />;
      default:
        return <Arena entrants={allEntrants} onStartDraw={handleStartDraw} />;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-screen">
      {renderStep()}
    </div>
  );
};

export default Index;
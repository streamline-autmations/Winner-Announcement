import { Entrant } from "@/services/airtable";
import ConfettiCannon from "./ConfettiCannon";

interface WinnerDisplayProps {
  winner: Entrant;
}

const WinnerDisplay = ({ winner }: WinnerDisplayProps) => {
  return (
    <div className="text-center animate-fade-in flex flex-col items-center justify-center p-8 bg-card/50 rounded-lg border-2 border-secondary shadow-2xl shadow-secondary/20 w-full">
      <ConfettiCannon fire={true} />
      <h2 className="text-2xl font-brand text-zinc-400 tracking-widest">The Winner Is...</h2>
      <p className="text-7xl font-bold text-secondary my-4 text-glow-gold animate-celebrate-text">{winner.name}</p>
      <p className="text-3xl font-brand text-white">Congratulations!</p>
    </div>
  );
};

export default WinnerDisplay;
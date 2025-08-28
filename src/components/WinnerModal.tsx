import { Entrant } from "@/services/airtable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import ConfettiCannon from "./ConfettiCannon";

interface WinnerModalProps {
  winner: Entrant | null;
  onClose: () => void;
}

const WinnerModal = ({ winner, onClose }: WinnerModalProps) => {
  const isOpen = !!winner;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-secondary text-center p-8 max-w-lg">
        <ConfettiCannon fire={isOpen} />
        <DialogHeader className="items-center">
          <img 
            src="/RECKLESSBEAR (1).png" 
            alt="Reckless Bear Logo" 
            className="h-16 w-auto mb-4"
            style={{ filter: 'brightness(0) saturate(100%) invert(70%) sepia(58%) saturate(587%) hue-rotate(359deg) brightness(93%) contrast(92%)' }}
          />
          <DialogTitle className="text-4xl font-brand title-brand">
            CONGRATULATIONS!
          </DialogTitle>
        </DialogHeader>
        
        <div className="my-6">
          <p className="text-5xl font-bold text-white my-4">{winner?.name}</p>
          <p className="text-lg text-zinc-300">You have won the Reckless Bear Logo Hunt!</p>
          <p className="text-2xl font-brand text-secondary mt-4">A grand prize of R10 000 is yours!</p>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose} className="button-brand">
            CLOSE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerModal;
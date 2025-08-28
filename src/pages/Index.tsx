import { useState } from "react";
import FinalistSelection from "@/components/FinalistSelection";
import Wheelspin from "@/components/Wheelspin";
import { saveFinalistsToAirtable, Entrant } from "@/services/airtable";
import { initialEntrants } from "@/data/participants";
import { toast } from "sonner";
import { showError, showLoading, showSuccess, dismissToast } from "@/utils/toast";

type DrawStep = 'arena' | 'wheelspin';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: Entrant[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Index = () => {
  const [step, setStep] = useState<DrawStep>('arena');
  const [allEntrants, setAllEntrants] = useState<Entrant[]>(() => shuffleArray(initialEntrants));
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectionTarget, setSelectionTarget] = useState<Entrant | null>(null);
  const [winner, setWinner] = useState<Entrant | null>(null);

  const handleSelectNextFinalist = () => {
    const available = allEntrants.filter(e => e.status === 'Entrant');
    if (available.length === 0 || isUpdating) return;

    setIsUpdating(true);
    const selected = available[Math.floor(Math.random() * available.length)];
    setSelectionTarget(selected);
  };

  const handleAnimationComplete = (selected: Entrant) => {
    setAllEntrants(prev => prev.map(e => e.id === selected.id ? { ...e, status: 'Finalist' as const } : e));
    toast.success(`${selected.name} has been selected as a finalist!`);
    setSelectionTarget(null);
    setIsUpdating(false);
  };

  const handleWinner = (winner: Entrant) => {
    setWinner(winner);
    setAllEntrants(prev => prev.map(e => e.id === winner.id ? { ...e, status: 'Winner' as const } : e));
    toast.success(`Congratulations to our winner, ${winner.name}!`);
  };

  const handleEliminateFinalist = (eliminated: Entrant) => {
    const updatedEntrants = allEntrants.map(e => e.id === eliminated.id ? { ...e, status: 'Eliminated' as const } : e);
    setAllEntrants(updatedEntrants);
    toast.error(`${eliminated.name} has been eliminated!`);

    const remaining = updatedEntrants.filter(e => e.status === 'Finalist');
    if (remaining.length === 1) {
      handleWinner(remaining[0]);
    }
  };

  const handleSaveResults = async () => {
    setIsSaving(true);
    const toastId = showLoading("Saving results to Airtable...");
    try {
      const finalists = allEntrants.filter(e => e.status === 'Finalist' || e.status === 'Eliminated' || e.status === 'Winner');
      await saveFinalistsToAirtable(finalists);
      dismissToast(String(toastId));
      showSuccess("Results saved successfully!");
    } catch (error) {
      dismissToast(String(toastId));
      showError("Failed to save results. Check Airtable connection.");
      console.error("Airtable save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    const entrants = allEntrants.filter(e => e.status === 'Entrant');
    const finalists = allEntrants.filter(e => e.status === 'Finalist' || e.status === 'Eliminated' || e.status === 'Winner');

    switch (step) {
      case 'arena':
        return (
          <FinalistSelection
            entrants={entrants}
            finalists={finalists}
            onSelectNext={handleSelectNextFinalist}
            onProceed={() => setStep('wheelspin')}
            isSelecting={isUpdating}
            selectionTarget={selectionTarget}
            onAnimationComplete={handleAnimationComplete}
          />
        );
      case 'wheelspin':
        return (
          <Wheelspin 
            finalists={finalists} 
            onEliminate={handleEliminateFinalist}
            winner={winner}
            onCloseWinnerModal={() => setWinner(null)}
            onSave={handleSaveResults}
            isSaving={isSaving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full brand-watermark">
      <div className="absolute top-4 left-4 z-20 flex items-center gap-4">
        <img src="/Golden-Logo (1).png" alt="Golden Logo" className="w-24 h-auto" />
        <img src="/RECKLESSBEAR (1).png" alt="Reckless Bear Logo" className="h-12 w-auto" />
      </div>
      <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-start min-h-screen relative z-10 pt-16">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
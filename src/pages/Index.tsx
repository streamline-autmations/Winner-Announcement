import { useState } from "react";
import FinalistSelection from "@/components/FinalistSelection";
import Gauntlet from "@/components/Gauntlet";
import Champion from "@/components/Champion";
import { saveFinalistsToAirtable, Entrant } from "@/services/airtable";
import { initialEntrants } from "@/data/participants";
import { RecklessBearLogo } from "@/components/RecklessBearLogo";
import { toast } from "sonner";
import { showError, showLoading, showSuccess, dismissToast } from "@/utils/toast";

type DrawStep = 'arena' | 'gauntlet' | 'champion';

const Index = () => {
  const [step, setStep] = useState<DrawStep>('arena');
  const [allEntrants, setAllEntrants] = useState<Entrant[]>(initialEntrants);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectionTarget, setSelectionTarget] = useState<Entrant | null>(null);

  const handleSelectNextFinalist = () => {
    const available = allEntrants.filter(e => e.status === 'Entrant');
    if (available.length === 0 || isUpdating) return;

    setIsUpdating(true);
    // Pick the winner secretly, then start the animation
    const selected = available[Math.floor(Math.random() * available.length)];
    setSelectionTarget(selected);
  };

  const handleAnimationComplete = (selected: Entrant) => {
    // This runs after the animation finishes
    setAllEntrants(prev => prev.map(e => e.id === selected.id ? { ...e, status: 'Finalist' } : e));
    toast.success(`${selected.name} has been selected as a finalist!`);
    setSelectionTarget(null); // Reset for next time
    setIsUpdating(false); // Re-enable the button
  };

  const handleEliminateFinalist = (eliminated: Entrant) => {
    setAllEntrants(prev => prev.map(e => e.id === eliminated.id ? { ...e, status: 'Eliminated' } : e));
    toast.error(`${eliminated.name} has been eliminated!`);

    const remaining = allEntrants.filter(e => e.status === 'Finalist' && e.id !== eliminated.id);
    if (remaining.length === 1) {
      handleWinner(remaining[0]);
    }
  };

  const handleWinner = (winner: Entrant) => {
    setTimeout(() => {
      setStep('champion');
      setAllEntrants(prev => prev.map(e => e.id === winner.id ? { ...e, status: 'Winner' } : e));
      toast.success(`Congratulations to our winner, ${winner.name}!`);
    }, 1500); // Delay to let the final elimination sink in
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
    const winner = allEntrants.find(e => e.status === 'Winner') || null;

    switch (step) {
      case 'arena':
        return (
          <FinalistSelection
            entrants={entrants}
            finalists={finalists}
            onSelectNext={handleSelectNextFinalist}
            onProceed={() => setStep('gauntlet')}
            isSelecting={isUpdating}
            selectionTarget={selectionTarget}
            onAnimationComplete={handleAnimationComplete}
          />
        );
      case 'gauntlet':
        return <Gauntlet finalists={finalists} onEliminate={handleEliminateFinalist} />;
      case 'champion':
        return <Champion winner={winner} onSave={handleSaveResults} isSaving={isSaving} />;
      default:
        return <RecklessBearLogo />;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-screen">
      {renderContent()}
    </div>
  );
};

export default Index;
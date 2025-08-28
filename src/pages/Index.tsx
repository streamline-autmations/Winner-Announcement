import { useState, useEffect } from "react";
import Arena from "@/components/Arena";
import Gauntlet from "@/components/Gauntlet";
import Champion from "@/components/Champion";
import { getEntrants, updateEntrantStatus, Entrant } from "@/services/airtable";
import { Skeleton } from "@/components/ui/skeleton";
import { RecklessBearLogo } from "@/components/RecklessBearLogo";
import { toast } from "sonner";

type DrawStep = 'arena' | 'gauntlet' | 'champion';

const Index = () => {
  const [step, setStep] = useState<DrawStep>('arena');
  const [allEntrants, setAllEntrants] = useState<Entrant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchEntrants = async () => {
      try {
        const entrants = await getEntrants();
        setAllEntrants(entrants);
      } catch (err) {
        setError('Failed to load participants. Please check your Airtable connection and refresh.');
        toast.error('Failed to load participants.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntrants();
  }, []);

  const handleSelectNextFinalist = async () => {
    const available = allEntrants.filter(e => e.status === 'Entrant');
    if (available.length === 0 || isUpdating) return;

    setIsUpdating(true);
    const selected = available[Math.floor(Math.random() * available.length)];
    
    try {
      setAllEntrants(prev => prev.map(e => e.id === selected.id ? { ...e, status: 'Finalist' } : e));
      toast.success(`${selected.name} has been selected as a finalist!`);
      await updateEntrantStatus(selected.id, 'Finalist');
    } catch (err) {
      setError("Failed to update finalist. Please try again.");
      toast.error(`Failed to save ${selected.name} as finalist.`);
      setAllEntrants(prev => prev.map(e => e.id === selected.id ? { ...e, status: 'Entrant' } : e));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEliminateFinalist = async (eliminated: Entrant) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      setAllEntrants(prev => prev.map(e => e.id === eliminated.id ? { ...e, status: 'Eliminated' } : e));
      toast.error(`${eliminated.name} has been eliminated!`);
      await updateEntrantStatus(eliminated.id, 'Eliminated');

      const remaining = allEntrants.filter(e => e.status === 'Finalist' && e.id !== eliminated.id);
      if (remaining.length === 1) {
        handleWinner(remaining[0]);
      }
    } catch (err) {
      setError("Failed to eliminate finalist. Please try again.");
      toast.error(`Failed to eliminate ${eliminated.name}.`);
      setAllEntrants(prev => prev.map(e => e.id === eliminated.id ? { ...e, status: 'Finalist' } : e));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWinner = async (winner: Entrant) => {
    setStep('champion');
    setAllEntrants(prev => prev.map(e => e.id === winner.id ? { ...e, status: 'Winner' } : e));
    toast.success(`Congratulations to our winner, ${winner.name}!`);
    await updateEntrantStatus(winner.id, 'Winner');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full max-w-4xl mx-auto text-center">
          <RecklessBearLogo />
          <h1 className="text-5xl font-brand my-6 text-glow-gold">LOADING PARTICIPANTS...</h1>
          <Skeleton className="w-full h-[50vh] bg-black/30 border-zinc-700 rounded-lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-10 bg-red-900/50 border border-red-500 rounded-lg">
          <h2 className="text-2xl font-brand text-red-400">An Error Occurred</h2>
          <p>{error}</p>
        </div>
      );
    }

    const entrants = allEntrants.filter(e => e.status === 'Entrant');
    const finalists = allEntrants.filter(e => e.status === 'Finalist' || e.status === 'Eliminated' || e.status === 'Winner');
    const winner = allEntrants.find(e => e.status === 'Winner') || null;

    switch (step) {
      case 'arena':
        return (
          <Arena
            entrants={entrants}
            finalists={finalists}
            onSelectNext={handleSelectNextFinalist}
            onProceed={() => setStep('gauntlet')}
            isSelecting={isUpdating}
          />
        );
      case 'gauntlet':
        return <Gauntlet finalists={finalists} onEliminate={handleEliminateFinalist} />;
      case 'champion':
        return <Champion winner={winner} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-screen">
      {renderContent()}
    </div>
  );
};

export default Index;
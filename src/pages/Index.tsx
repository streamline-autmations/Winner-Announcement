import { useState, useEffect } from "react";
import Arena from "@/components/Arena";
import Gauntlet from "@/components/Gauntlet";
import Champion from "@/components/Champion";
import { getEntrants, updateEntrantStatus, Entrant } from "@/services/airtable";
import { Skeleton } from "@/components/ui/skeleton";
import { RecklessBearLogo } from "@/components/RecklessBearLogo";

type DrawStep = 'arena' | 'gauntlet' | 'champion';

const Index = () => {
  const [step, setStep] = useState<DrawStep>('arena');
  const [availableEntrants, setAvailableEntrants] = useState<Entrant[]>([]);
  const [finalists, setFinalists] = useState<Entrant[]>([]);
  const [winner, setWinner] = useState<Entrant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    const fetchEntrants = async () => {
      try {
        const allEntrants = await getEntrants();
        // If you refresh, this will correctly sort people who are already finalists
        setAvailableEntrants(allEntrants.filter(e => e.status === 'Entrant'));
        setFinalists(allEntrants.filter(e => e.status === 'Finalist'));
      } catch (err) {
        setError('Failed to load participants. Please check your Airtable connection and refresh.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntrants();
  }, []);

  const handleSelectNextFinalist = async () => {
    if (availableEntrants.length === 0 || finalists.length >= 5 || isSelecting) return;

    setIsSelecting(true);

    const randomIndex = Math.floor(Math.random() * availableEntrants.length);
    const selected = availableEntrants[randomIndex];

    try {
      // Update the screen immediately for a snappy feel
      setFinalists(prev => [...prev, { ...selected, status: 'Finalist' }]);
      setAvailableEntrants(prev => prev.filter(e => e.id !== selected.id));

      // Update Airtable in the background
      await updateEntrantStatus(selected.id, 'Finalist');
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update finalist. Please try again.");
      // If the API call fails, revert the change on screen
      setFinalists(prev => prev.filter(f => f.id !== selected.id));
      setAvailableEntrants(prev => [...prev, selected].sort((a, b) => a.name.localeCompare(b.name)));
    } finally {
      setIsSelecting(false);
    }
  };

  const handleProceedToGauntlet = () => {
    if (finalists.length >= 5) {
      setStep('gauntlet');
    }
  };

  const handleDrawComplete = (winner: Entrant) => {
    setWinner(winner);
    setStep('champion');
    // Optional: update winner status in Airtable
    updateEntrantStatus(winner.id, 'Winner').catch(err => console.error("Failed to update winner status:", err));
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

    switch (step) {
      case 'arena':
        return (
          <Arena
            entrants={availableEntrants}
            finalists={finalists}
            onSelectNext={handleSelectNextFinalist}
            onProceed={handleProceedToGauntlet}
            isSelecting={isSelecting}
          />
        );
      case 'gauntlet':
        return <Gauntlet finalists={finalists} onDrawComplete={handleDrawComplete} />;
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
import { Gem } from 'lucide-react';

export const RecklessBearLogo = ({ size = 80 }: { size?: number }) => {
  return (
    <div className="flex justify-center items-center text-glow-gold" style={{ height: size, width: size }}>
      {/* Placeholder for the RB monogram. Using a gem icon for now. */}
      <Gem size={size} />
    </div>
  );
};
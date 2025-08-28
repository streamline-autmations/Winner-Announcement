import React, { useMemo, useEffect, useState } from 'react';
import { Entrant } from '@/services/airtable';

interface CustomWheelProps {
  finalists: Entrant[];
  mustSpin: boolean;
  prizeNumber: number;
  onSpinEnd: () => void;
}

const CustomWheel: React.FC<CustomWheelProps> = ({ finalists, mustSpin, prizeNumber, onSpinEnd }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const wheelGradient = useMemo(() => {
    const numSegments = finalists.length;
    if (numSegments === 0) return '';
    const segmentAngle = 360 / numSegments;
    const colors = ['hsl(var(--primary))', 'hsl(var(--secondary))'];
    
    const segments = finalists.map((_, i) => {
      const color = colors[i % 2];
      const startAngle = i * segmentAngle;
      const endAngle = (i + 1) * segmentAngle;
      return `${color} ${startAngle}deg ${endAngle}deg`;
    });

    return `conic-gradient(from -90deg, ${segments.join(', ')})`;
  }, [finalists]);

  useEffect(() => {
    if (mustSpin && !isSpinning) {
      setIsSpinning(true);
      
      const numSegments = finalists.length;
      const segmentAngle = 360 / numSegments;
      
      const targetSegmentCenter = (prizeNumber * segmentAngle) + (segmentAngle / 2);
      const targetRotation = 360 - targetSegmentCenter;

      const fullSpins = 5 + Math.floor(Math.random() * 3);
      const finalRotation = (rotation - (rotation % 360)) + (360 * fullSpins) + targetRotation;

      setRotation(finalRotation);

      const timer = setTimeout(() => {
        setIsSpinning(false);
        onSpinEnd();
      }, 6000); // Corresponds to the transition duration

      return () => clearTimeout(timer);
    }
  }, [mustSpin, isSpinning, prizeNumber, finalists, onSpinEnd, rotation]);

  return (
    <div className="wheel-container">
      <div 
        className="wheel"
        style={{
          '--wheel-gradient': wheelGradient,
          transform: `rotate(${rotation}deg)`,
        } as React.CSSProperties}
      />
      <div className="wheel-centerpiece">
        <img src="/Golden-Logo (1).png" alt="Golden Logo" className="w-12 h-12" />
      </div>
      <div className="wheel-pointer-container">
        <div className="wheel-pointer" />
      </div>
      <div className={`wheel-glow ${isSpinning ? 'active' : ''}`} />
    </div>
  );
};

export default CustomWheel;
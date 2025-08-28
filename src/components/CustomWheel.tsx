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

  const wheelData = useMemo(() => {
    const numSegments = finalists.length;
    if (numSegments === 0) return { gradient: '', segments: [] };
    
    const segmentAngle = 360 / numSegments;
    const colors = ['hsl(var(--primary))', 'hsl(var(--secondary))'];
    const separatorColor = '#11100f';
    const separatorWidth = numSegments > 1 ? 1 : 0; // 1 degree for the separator line

    const gradientSegments = finalists.map((_, i) => {
      const color = colors[i % 2];
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle - separatorWidth;
      return `${color} ${startAngle}deg ${endAngle}deg, ${separatorColor} ${endAngle}deg ${startAngle + segmentAngle}deg`;
    });

    const wheelSegments = finalists.map((finalist, i) => ({
      ...finalist,
      rotation: (i * segmentAngle) + (segmentAngle / 2),
    }));

    return {
      gradient: `conic-gradient(from -90deg, ${gradientSegments.join(', ')})`,
      segments: wheelSegments,
    };
  }, [finalists]);

  useEffect(() => {
    if (mustSpin && !isSpinning) {
      setIsSpinning(true);
      
      const numSegments = finalists.length;
      const segmentAngle = 360 / numSegments;
      
      const targetSegmentCenter = (prizeNumber * segmentAngle) + (segmentAngle / 2);
      // The pointer is at the top (0 degrees), so we need to rotate the target segment to the top.
      // The wheel rotates clockwise, so we calculate the negative rotation.
      const targetRotation = 360 - targetSegmentCenter;

      // Add multiple full spins for effect
      const fullSpins = 5 + Math.floor(Math.random() * 3);
      // Ensure we start from the current visual rotation to avoid jumps
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
          '--wheel-gradient': wheelData.gradient,
          transform: `rotate(${rotation}deg)`,
        } as React.CSSProperties}
      >
        {wheelData.segments.map((segment) => (
          <div
            key={segment.id}
            className="absolute w-1/2 h-1/2 top-1/4 left-1/4 origin-bottom-left flex items-center"
            style={{ transform: `rotate(${segment.rotation}deg)` }}
          >
            <span 
              className="text-sm font-bold uppercase tracking-wider pl-4"
              style={{ transform: 'rotate(-90deg)', color: 'hsl(var(--secondary-foreground))', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {segment.name}
            </span>
          </div>
        ))}
      </div>
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
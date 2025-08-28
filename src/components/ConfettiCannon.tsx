import React, { useEffect, useRef, useCallback } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

interface ConfettiCannonProps {
  fire: boolean;
  onComplete?: () => void;
}

const canvasStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 100,
};

const ConfettiCannon: React.FC<ConfettiCannonProps> = ({ fire, onComplete }) => {
  const refAnimationInstance = useRef<any>(null);

  const onInitHandler = useCallback(({ confetti }: { confetti: any }) => {
    refAnimationInstance.current = confetti;
  }, []);

  const makeShot = useCallback((particleRatio: number, opts: object) => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.6 },
        particleCount: Math.floor(200 * particleRatio),
        colors: ['#ffd700', '#ffab00', '#ff6d00', '#ffffff'],
      });
    }
  }, []);

  const fireConfetti = useCallback(() => {
    makeShot(0.25, { spread: 30, startVelocity: 60 });
    makeShot(0.2, { spread: 60 });
    makeShot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    makeShot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    makeShot(0.1, { spread: 120, startVelocity: 45 });
    
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);
  }, [makeShot, onComplete]);

  useEffect(() => {
    if (fire) {
      fireConfetti();
    }
  }, [fire, fireConfetti]);

  return <ReactCanvasConfetti onInit={onInitHandler} style={canvasStyles} />;
};

export default ConfettiCannon;
import { useEffect } from "react";

interface SelectionProps {
  onAnimationEnd: () => void;
}

const Selection = ({ onAnimationEnd }: SelectionProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 8000);
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
      <div className="w-full h-full absolute top-0 left-0 overflow-hidden">
        {/* Placeholder for fast-scrolling blurred names GIF */}
        <div className="absolute inset-0 bg-[url('https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExb255a254a250a255a254a254a254a254a254a254/3o7TKsWZb3nvefocI8/giphy.gif')] bg-cover opacity-30"></div>
      </div>
      <h1 className="text-6xl font-brand text-glow-gold z-10">
        SELECTING THE ELITE...
      </h1>
    </div>
  );
};

export default Selection;
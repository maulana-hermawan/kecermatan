
import React, { useState, useEffect } from 'react';

interface CountdownScreenProps {
  onCountdownFinish: () => void;
}

export const CountdownScreen: React.FC<CountdownScreenProps> = ({ onCountdownFinish }) => {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count <= 0) {
      // Short delay to show "MULAI!" before transitioning
      setTimeout(onCountdownFinish, 800);
      return;
    }

    const timerId = setInterval(() => {
      setCount(prevCount => prevCount - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [count, onCountdownFinish]);

  return (
    <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
      <p className="text-2xl font-bold text-slate-800 mb-4">
        {count > 0 ? "Tes akan dimulai dalam..." : "Persiapkan diri Anda!"}
      </p>
      <div 
        className="text-9xl font-extrabold text-yellow-500" 
        style={{fontVariantNumeric: 'tabular-nums'}}
      >
        {count > 0 ? count : 'MULAI!'}
      </div>
    </div>
  );
};
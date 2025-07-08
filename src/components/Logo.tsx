
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      <img src="https://drive.google.com/uc?export=view&id=1Cgm7L8KTX3wFM-HxLaUTk8boGz0bBo6d" alt="Logo Binjas Perkasa" className="w-20 h-20 object-contain" />
      <div className="text-left">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase">CAT Polri - Tes Kecermatan</h1>
        <h2 className="text-lg sm:text-xl font-semibold text-yellow-300">BINJAS PERKASA</h2>
      </div>
    </div>
  );
};

export default Logo;
import React from 'react';

interface InstructionsScreenProps {
  playerName: string;
  onBeginTest: () => void;
}

export const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ playerName, onBeginTest }) => {
  return (
    <div className="text-left animate-fade-in max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
        Siap, <span className="text-yellow-500">{playerName}</span>?
      </h2>
      <p className="text-slate-600 mb-6 text-center">Berikut adalah petunjuk untuk tes kecermatan.</p>
      
      <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
        <InstructionItem>Anda akan menghadapi <strong>10 ronde</strong> tes kecermatan.</InstructionItem>
        <InstructionItem>Setiap ronde berlangsung selama <strong>60 detik</strong>, diikuti istirahat singkat <strong>5 detik</strong>.</InstructionItem>
        <InstructionItem>Di setiap ronde, Anda akan melihat <strong>CONTOH</strong> kode (misal: MAV5G).</InstructionItem>
        <InstructionItem>Di bawahnya, akan muncul <strong>SOAL</strong> yang merupakan urutan acak dari CONTOH dengan <strong>satu karakter yang hilang</strong>.</InstructionItem>
        <InstructionItem>Tugas Anda adalah menemukan karakter yang hilang dan memilihnya dari opsi yang tersedia <strong>secepat mungkin</strong>.</InstructionItem>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={onBeginTest}
          className="bg-slate-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-700 active:bg-slate-900 transition-transform transform hover:scale-105"
        >
          Mulai Tes Sekarang
        </button>
      </div>
    </div>
  );
};

const InstructionItem: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-slate-700">{children}</p>
    </div>
);

import React, { useState } from 'react';

interface NameInputScreenProps {
  onStart: (name: string) => void;
}

const NameInputScreen: React.FC<NameInputScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Selamat Datang!</h2>
      <p className="text-slate-600 mb-6">Silakan masukkan nama lengkap Anda untuk memulai tes.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama Lengkap"
          className="w-full max-w-sm px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          required
        />
        <button
          type="submit"
          className="w-full max-w-sm bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 active:bg-slate-900 transition-transform transform hover:scale-105"
        >
          Mulai Tes
        </button>
      </form>
    </div>
  );
};

export default NameInputScreen;
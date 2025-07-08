import React, { useEffect } from 'react';
import { useTestLogic } from '@/hooks/useTestLogic';
import { RoundResult } from '@/types';
import SpinnerIcon from '@/components/icons/SpinnerIcon';
import { TOTAL_ROUNDS } from '@/constants';

interface TestScreenProps {
  playerName: string;
  onFinishTest: (results: RoundResult[]) => void;
}

const TestScreen: React.FC<TestScreenProps> = ({ playerName, onFinishTest }) => {
  const {
    isActive,
    isBreak,
    currentRound,
    timeLeft,
    breakTimeLeft,
    currentQuestion,
    roundStats,
    startTest,
    endRound,
    endTestManually,
    handleAnswer,
  } = useTestLogic(onFinishTest);

  useEffect(() => {
    startTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <SpinnerIcon className="h-12 w-12 text-slate-800" />
        <p className="mt-4 text-lg text-slate-600">Mempersiapkan tes...</p>
      </div>
    );
  }

  if (isBreak) {
    return (
      <div className="text-center p-8 bg-yellow-100 border-4 border-dashed border-yellow-400 rounded-xl">
        <h2 className="text-2xl font-bold text-slate-800">ISTIRAHAT</h2>
        <p className="text-slate-600 mt-2">Ronde berikutnya akan dimulai dalam:</p>
        <div className="text-6xl font-bold text-slate-900 my-4">{breakTimeLeft}</div>
        <SpinnerIcon className="h-8 w-8 text-slate-800 mx-auto" />
      </div>
    );
  }
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center">
      {/* Header Info */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 text-center mb-6 p-4 bg-slate-100 rounded-lg shadow-inner">
        <div className="sm:col-span-1 col-span-2 sm:text-left">
          <p className="text-sm font-semibold text-slate-500">Peserta</p>
          <p className="text-lg font-bold text-slate-800 truncate">{playerName}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">Ronde</p>
          <p className="text-lg font-bold text-slate-800">{currentRound + 1} / {TOTAL_ROUNDS}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">Waktu</p>
          <p className="text-lg font-bold text-red-600">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
        </div>
      </div>

      {/* Question Area */}
      {currentQuestion ? (
        <div className="w-full flex flex-col items-center space-y-6">
          <div>
            <p className="text-center font-bold text-red-600">CONTOH LENGKAP</p>
            <div className="mt-1 p-4 bg-white border-2 border-slate-800 text-3xl md:text-4xl font-mono tracking-[0.5em] text-center rounded-lg shadow-md">
              {currentQuestion.contoh}
            </div>
          </div>
          <div>
            <p className="text-center font-bold text-orange-500">SOAL</p>
            <div className="mt-1 p-4 bg-white border-2 border-slate-800 text-3xl md:text-4xl font-mono tracking-[0.5em] text-center rounded-lg shadow-md">
              {currentQuestion.soal}
            </div>
          </div>

          <div className="w-full flex justify-center flex-wrap gap-3 pt-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl font-bold border-2 border-slate-800 rounded-lg bg-white hover:bg-yellow-200 transition-all duration-150 transform hover:scale-110 active:scale-100 shadow-lg"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
         <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-slate-800">Ronde Selesai!</h2>
             <p className="text-slate-600 mt-2">Anda telah menyelesaikan semua soal di ronde ini.</p>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="mt-8 pt-6 border-t border-slate-200 w-full flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={endRound}
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition"
          >
            Lanjut Ronde Berikutnya
          </button>
          <button 
            onClick={endTestManually}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
          >
            Akhiri Tes
          </button>
      </div>

    </div>
  );
};

export default TestScreen;
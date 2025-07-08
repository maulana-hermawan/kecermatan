import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RoundResult, AnalysisReport } from '@/types';
import { analyzePerformance } from '@/utils/analysis';
import PerformanceAnalysis from '@/components/PerformanceAnalysis';

interface ResultsScreenProps {
  playerName: string;
  results: RoundResult[];
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ playerName, results, onRestart }) => {
  const totalStats = useMemo(() => {
    return results.reduce(
      (acc, round) => {
        acc.answered += round.answered;
        acc.correct += round.correct;
        acc.incorrect += round.incorrect;
        return acc;
      },
      { answered: 0, correct: 0, incorrect: 0 }
    );
  }, [results]);
  
  const performanceReport: AnalysisReport = useMemo(() => analyzePerformance(results), [results]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-2">Hasil Tes</h2>
      <p className="text-center text-slate-600 text-lg mb-6">Peserta: <span className="font-bold">{playerName}</span></p>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center">
        <div className="bg-slate-100 p-4 rounded-lg shadow-inner">
          <p className="text-sm font-semibold text-slate-500">Total Jawaban</p>
          <p className="text-3xl font-bold text-slate-800">{totalStats.answered}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-inner">
          <p className="text-sm font-semibold text-green-700">Jawaban Benar</p>
          <p className="text-3xl font-bold text-green-600">{totalStats.correct}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow-inner">
          <p className="text-sm font-semibold text-red-700">Jawaban Salah</p>
          <p className="text-3xl font-bold text-red-600">{totalStats.incorrect}</p>
        </div>
      </div>
      
      {/* Performance Analysis */}
      <PerformanceAnalysis report={performanceReport} />
      
      {/* Chart */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-700 text-center mb-4">Grafik Hasil per Ronde</h3>
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={results} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="round" tickFormatter={(label) => `R${label}`} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(2px)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar dataKey="correct" name="Benar" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incorrect" name="Salah" fill="#dc2626" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      {/* Details Table */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-700 text-center mb-4">Detail per Ronde</h3>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-center">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">Ronde</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-xs font-medium text-green-700 uppercase tracking-wider">Benar</th>
                <th className="px-6 py-3 text-xs font-medium text-red-700 uppercase tracking-wider">Salah</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {results.map((r) => (
                <tr key={r.round}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">{r.round}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">{r.answered}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">{r.correct}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-red-600">{r.incorrect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Restart Button */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="bg-slate-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-700 active:bg-slate-900 transition-transform transform hover:scale-105"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
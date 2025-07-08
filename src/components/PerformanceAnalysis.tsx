import React from 'react';
import { AnalysisReport, PerformanceAspect } from '@/types';

const AspectCard: React.FC<{ title: string; aspect: PerformanceAspect; icon: JSX.Element }> = ({ title, aspect, icon }) => {
  const levelColorClasses: { [key: string]: string } = {
    'Sangat Cepat': 'bg-blue-100 text-blue-800',
    'Cepat': 'bg-blue-100 text-blue-800',
    'Sangat Teliti': 'bg-green-100 text-green-800',
    'Teliti': 'bg-green-100 text-green-800',
    'Sangat Baik': 'bg-purple-100 text-purple-800',
    'Baik': 'bg-purple-100 text-purple-800',
    'Sangat Stabil': 'bg-indigo-100 text-indigo-800',
    'Cukup Stabil': 'bg-indigo-100 text-indigo-800',
    'Cukup': 'bg-yellow-100 text-yellow-800',
    'Cukup Teliti': 'bg-yellow-100 text-yellow-800',
    'Perlu Ditingkatkan': 'bg-red-100 text-red-800',
    'Kurang Stabil': 'bg-red-100 text-red-800',
    'N/A': 'bg-slate-100 text-slate-800',
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-start gap-4">
      <div className="flex-shrink-0 text-slate-500">
        {React.cloneElement(icon, { className: 'w-8 h-8' })}
      </div>
      <div>
        <h4 className="font-bold text-slate-700">{title}</h4>
        <span className={`inline-block px-2 py-0.5 text-sm font-semibold rounded-full mt-1 mb-2 ${levelColorClasses[aspect.level] || 'bg-slate-100 text-slate-800'}`}>
          {aspect.level}
        </span>
        <p className="text-slate-600 text-sm">{aspect.description}</p>
      </div>
    </div>
  );
};


const PerformanceAnalysis: React.FC<{ report: AnalysisReport }> = ({ report }) => {
  return (
    <div className="my-8">
       <h3 className="text-xl font-bold text-slate-700 text-center mb-4">Analisis Kinerja Psikologis</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AspectCard 
          title="Kecepatan (Speed)"
          aspect={report.speed}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>}
        />
        <AspectCard 
          title="Ketelitian (Accuracy)"
          aspect={report.accuracy}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
        />
        <AspectCard 
          title="Daya Tahan (Endurance)"
          aspect={report.endurance}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.69v4.99" /></svg>}
        />
        <AspectCard 
          title="Konsistensi (Consistency)"
          aspect={report.consistency}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-12a2.25 2.25 0 01-2.25-2.25V3z" /></svg>}
        />
       </div>
    </div>
  );
};

export default PerformanceAnalysis;
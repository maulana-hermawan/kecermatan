import { RoundResult, AnalysisReport, PerformanceAspect } from '@/types';

const calculateAverage = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  return arr.reduce((acc, val) => acc + val, 0) / arr.length;
};

const calculateStdDev = (arr: number[]): number => {
  const n = arr.length;
  if (n < 2) return 0;
  const mean = calculateAverage(arr);
  const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n -1);
  return Math.sqrt(variance);
};

const getSpeedAnalysis = (avgAnswered: number): PerformanceAspect => {
  if (avgAnswered >= 30) return { level: 'Sangat Cepat', description: 'Kecepatan kerja Anda luar biasa, mampu memproses informasi dan menjawab dengan sangat efisien.' };
  if (avgAnswered >= 20) return { level: 'Cepat', description: 'Anda memiliki kecepatan kerja di atas rata-rata. Ini adalah aset penting dalam tes berbasis waktu.' };
  if (avgAnswered >= 10) return { level: 'Cukup', description: 'Kecepatan kerja Anda berada pada tingkat yang memadai. Latihan dapat membantu meningkatkannya.' };
  return { level: 'Perlu Ditingkatkan', description: 'Kecepatan Anda masih bisa dioptimalkan. Fokus pada pengenalan pola untuk mempercepat respons.' };
};

const getAccuracyAnalysis = (totalCorrect: number, totalAnswered: number): PerformanceAspect => {
  if (totalAnswered === 0) return { level: 'N/A', description: 'Tidak ada jawaban yang tercatat untuk dianalisis.' };
  const accuracyPercentage = (totalCorrect / totalAnswered) * 100;
  if (accuracyPercentage >= 95) return { level: 'Sangat Teliti', description: 'Tingkat ketelitian Anda sangat tinggi. Anda mampu bekerja cepat tanpa mengorbankan kualitas.' };
  if (accuracyPercentage >= 85) return { level: 'Teliti', description: 'Anda mampu menjaga ketelitian dengan baik. Pertahankan fokus untuk meminimalkan kesalahan kecil.' };
  if (accuracyPercentage >= 75) return { level: 'Cukup Teliti', description: 'Ketelitian Anda cukup, namun ada ruang untuk perbaikan. Periksa kembali sebelum memilih.' };
  return { level: 'Perlu Ditingkatkan', description: 'Banyak terjadi kesalahan. Coba untuk sedikit lebih tenang dan fokus pada ketepatan jawaban.' };
};

const getEnduranceAnalysis = (answeredPerRound: number[]): PerformanceAspect => {
  const totalRounds = answeredPerRound.length;
  if (totalRounds < 4) return { level: 'N/A', description: 'Data tidak cukup untuk menganalisis daya tahan.' };

  const firstHalf = answeredPerRound.slice(0, Math.floor(totalRounds / 2));
  const secondHalf = answeredPerRound.slice(Math.ceil(totalRounds / 2));

  const avgFirstHalf = calculateAverage(firstHalf);
  const avgSecondHalf = calculateAverage(secondHalf);

  if (avgSecondHalf >= avgFirstHalf * 0.95) return { level: 'Sangat Baik', description: 'Daya tahan Anda luar biasa. Anda mampu menjaga atau bahkan meningkatkan performa di bawah tekanan waktu yang lama.' };
  if (avgSecondHalf >= avgFirstHalf * 0.85) return { level: 'Baik', description: 'Anda memiliki daya tahan yang baik, hanya terjadi sedikit penurunan performa seiring berjalannya waktu.' };
  if (avgSecondHalf >= avgFirstHalf * 0.75) return { level: 'Cukup', description: 'Terlihat adanya tanda-tanda kelelahan. Performa Anda cenderung menurun pada paruh akhir tes.' };
  return { level: 'Perlu Ditingkatkan', description: 'Terjadi penurunan performa yang signifikan. Latih konsentrasi dan stamina untuk menjaga stabilitas kerja.' };
};

const getConsistencyAnalysis = (answeredPerRound: number[]): PerformanceAspect => {
  const avg = calculateAverage(answeredPerRound);
  if (avg === 0) return { level: 'N/A', description: 'Tidak ada jawaban yang tercatat.' };
  const stdDev = calculateStdDev(answeredPerRound);
  const coefficientOfVariation = (stdDev / avg) * 100;

  if (coefficientOfVariation <= 15) return { level: 'Sangat Stabil', description: 'Ritme kerja Anda sangat konsisten. Ini menunjukkan tingkat fokus dan stabilitas emosi yang tinggi.' };
  if (coefficientOfVariation <= 25) return { level: 'Cukup Stabil', description: 'Ritme kerja Anda cukup konsisten, meskipun ada sedikit fluktuasi antar ronde.' };
  return { level: 'Kurang Stabil', description: 'Performa Anda cenderung naik-turun. Latih untuk menjaga ritme kerja yang lebih stabil di setiap ronde.' };
};

export const analyzePerformance = (results: RoundResult[]): AnalysisReport => {
  const totalAnswered = results.reduce((sum, r) => sum + r.answered, 0);
  const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
  const answeredPerRound = results.map(r => r.answered);
  const avgAnswered = calculateAverage(answeredPerRound);

  return {
    speed: getSpeedAnalysis(avgAnswered),
    accuracy: getAccuracyAnalysis(totalCorrect, totalAnswered),
    endurance: getEnduranceAnalysis(answeredPerRound),
    consistency: getConsistencyAnalysis(answeredPerRound),
  };
};
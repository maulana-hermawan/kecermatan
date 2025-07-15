// =================================================================================
// KONSTANTA
// =================================================================================
const TOTAL_ROUNDS = 10;
const ROUND_DURATION_SECONDS = 75;
const BREAK_DURATION_SECONDS = 7;
const PRE_TEST_COUNTDOWN_SECONDS = 5;
const EXAMPLE_TEMPLATES = ["58902", "36748", "34523", "73840", "91842", "IO01B", "W7RVA", "KJH3Q", "9AZX2", "MB7CQ"];
const NUM_QUESTIONS_PER_ROUND = 50;
const NUM_OPTIONS = 5;

// =================================================================================
// UTILITAS
// =================================================================================
const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// ... (sisa kode JavaScript dari file asli, mulai dari LOGIKA ANALISIS KINERJA hingga akhir)
// ...

// =================================================================================
// LOGIKA ANALISIS KINERJA
// =================================================================================
const calculateAverage = (arr) => arr.length === 0 ? 0 : arr.reduce((acc, val) => acc + val, 0) / arr.length;
const calculateStdDev = (arr) => {
    const n = arr.length;
    if (n < 2) return 0;
    const mean = calculateAverage(arr);
    const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
    return Math.sqrt(variance);
};
const getSpeedAnalysis = (avgAnswered) => {
            if (avgAnswered >= 30) return { level: 'Sangat Cepat', description: 'Kecepatan kerja Anda luar biasa, mampu memproses informasi dan menjawab dengan sangat efisien.' };
            if (avgAnswered >= 20) return { level: 'Cepat', description: 'Anda memiliki kecepatan kerja di atas rata-rata. Ini adalah aset penting dalam tes berbasis waktu.' };
            if (avgAnswered >= 10) return { level: 'Cukup', description: 'Kecepatan kerja Anda berada pada tingkat yang memadai. Latihan dapat membantu meningkatkannya.' };
            return { level: 'Perlu Ditingkatkan', description: 'Kecepatan Anda masih bisa dioptimalkan. Fokus pada pengenalan pola untuk mempercepat respons.' };
        };

        const getAccuracyAnalysis = (totalCorrect, totalAnswered) => {
            if (totalAnswered === 0) return { level: 'N/A', description: 'Tidak ada jawaban yang tercatat untuk dianalisis.' };
            const accuracyPercentage = (totalCorrect / totalAnswered) * 100;
            if (accuracyPercentage >= 95) return { level: 'Sangat Teliti', description: 'Tingkat ketelitian Anda sangat tinggi. Anda mampu bekerja cepat tanpa mengorbankan kualitas.' };
            if (accuracyPercentage >= 85) return { level: 'Teliti', description: 'Anda mampu menjaga ketelitian dengan baik. Pertahankan fokus untuk meminimalkan kesalahan kecil.' };
            if (accuracyPercentage >= 75) return { level: 'Cukup Teliti', description: 'Ketelitian Anda cukup, namun ada ruang untuk perbaikan. Periksa kembali sebelum memilih.' };
            return { level: 'Perlu Ditingkatkan', description: 'Banyak terjadi kesalahan. Coba untuk sedikit lebih tenang dan fokus pada ketepatan jawaban.' };
        };

        const getEnduranceAnalysis = (answeredPerRound) => {
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

        const getConsistencyAnalysis = (answeredPerRound) => {
            const avg = calculateAverage(answeredPerRound);
            if (avg === 0) return { level: 'N/A', description: 'Tidak ada jawaban yang tercatat.' };
            const stdDev = calculateStdDev(answeredPerRound);
            const coefficientOfVariation = (stdDev / avg) * 100;
            if (coefficientOfVariation <= 15) return { level: 'Sangat Stabil', description: 'Ritme kerja Anda sangat konsisten. Ini menunjukkan tingkat fokus dan stabilitas emosi yang tinggi.' };
            if (coefficientOfVariation <= 25) return { level: 'Cukup Stabil', description: 'Ritme kerja Anda cukup konsisten, meskipun ada sedikit fluktuasi antar ronde.' };
            return { level: 'Kurang Stabil', description: 'Performa Anda cenderung naik-turun. Latih untuk menjaga ritme kerja yang lebih stabil di setiap ronde.' };
        };

        const analyzePerformance = (results) => {
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

        // =================================================================================
        // KELAS LOGIKA TES
        // =================================================================================
        class TestLogic {
            constructor(onUpdate, onFinish, onBreakStart, onBreakEnd) {
                this.onUpdate = onUpdate;
                this.onFinish = onFinish;
                this.onBreakStart = onBreakStart;
                this.onBreakEnd = onBreakEnd;

                this.isActive = false;
                this.isBreak = false;
                this.currentRound = 0;
                this.timeLeft = ROUND_DURATION_SECONDS;
                this.breakTimeLeft = BREAK_DURATION_SECONDS;
                this.questions = [];
                this.currentQuestionIndex = 0;
                this.roundStats = { correct: 0, incorrect: 0 };
                this.allRoundResults = [];
                this.roundTimerId = null;
                this.breakTimerId = null;
            }

            generateQuestionsForRound(roundIndex) {
                const template = EXAMPLE_TEMPLATES[roundIndex % EXAMPLE_TEMPLATES.length];
                this.questions = [];
                for (let i = 0; i < NUM_QUESTIONS_PER_ROUND; i++) {
                    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    const missingIndex = Math.floor(Math.random() * template.length);
                    const jawaban = template[missingIndex];
                    const soalArray = template.split('');
                    soalArray.splice(missingIndex, 1);
                    const soal = shuffle(soalArray).join('');
                    const optionsSet = new Set([jawaban]);
                    while (optionsSet.size < NUM_OPTIONS) {
                        const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
                        if (!optionsSet.has(randomChar) && !template.includes(randomChar)) { 
                            optionsSet.add(randomChar);
                        }
                    }
                    this.questions.push({ soal, jawaban, contoh: template, options: shuffle(Array.from(optionsSet)) });
                }
            }
            
            startNewRound() {
                this.isBreak = false;
                this.timeLeft = ROUND_DURATION_SECONDS;
                this.roundStats = { correct: 0, incorrect: 0 };
                this.currentQuestionIndex = 0;
                this.generateQuestionsForRound(this.currentRound);
                this.onBreakEnd(); 
                this.startRoundTimer();
            }
            
            startBreak() {
                this.isBreak = true;
                this.breakTimeLeft = BREAK_DURATION_SECONDS;
                this.onBreakStart(this.breakTimeLeft); 
                this.breakTimerId = setInterval(() => {
                    this.breakTimeLeft--;
                    this.onBreakStart(this.breakTimeLeft); 
                    if (this.breakTimeLeft <= 0) {
                        clearInterval(this.breakTimerId);
                        this.currentRound++;
                        this.startNewRound();
                    }
                }, 1000);
            }

            startTest() {
                this.isActive = true;
                this.allRoundResults = [];
                this.currentRound = 0;
                this.startNewRound();
            }
            
            startRoundTimer() {
                this.roundTimerId = setInterval(() => {
                    this.timeLeft--;
                    this.onUpdate({ 
                        timeLeft: this.timeLeft,
                        currentRound: this.currentRound,
                        currentQuestion: this.questions[this.currentQuestionIndex] 
                    });
                    if (this.timeLeft <= 0) {
                        this.endRound();
                    }
                }, 1000);
            }
            
            stopTimers() {
                clearInterval(this.roundTimerId);
                clearInterval(this.breakTimerId);
                this.roundTimerId = null;
                this.breakTimerId = null;
            }

            endRound() {
                this.stopTimers();
                const newResult = {
                    round: this.currentRound + 1,
                    answered: this.roundStats.correct + this.roundStats.incorrect,
                    correct: this.roundStats.correct,
                    incorrect: this.roundStats.incorrect,
                };
                this.allRoundResults.push(newResult);

                if (this.currentRound + 1 >= TOTAL_ROUNDS) {
                    this.endTestManually(); 
                } else {
                    this.startBreak();
                }
            }

            endTestManually() {
                this.stopTimers();
                this.isActive = false;

                const lastRoundResult = this.allRoundResults.find(r => r.round === this.currentRound + 1);
                if (!lastRoundResult) { 
                    const finalResult = {
                        round: this.currentRound + 1,
                        answered: this.roundStats.correct + this.roundStats.incorrect,
                        correct: this.roundStats.correct,
                        incorrect: this.roundStats.incorrect,
                    };
                    this.allRoundResults.push(finalResult);
                }
                
                this.onFinish(this.allRoundResults);
            }

            handleAnswer(selectedAnswer) {
                if (this.isBreak || !this.isActive) return;

                const currentQuestion = this.questions[this.currentQuestionIndex];
                if (selectedAnswer.toUpperCase() === currentQuestion.jawaban.toUpperCase()) {
                    this.roundStats.correct++;
                } else {
                    this.roundStats.incorrect++;
                }
                
                if (this.currentQuestionIndex >= this.questions.length - 1) {
                    this.endRound();
                } else {
                    this.currentQuestionIndex++;
                    this.onUpdate({ 
                        timeLeft: this.timeLeft,
                        currentRound: this.currentRound,
                        currentQuestion: this.questions[this.currentQuestionIndex] 
                    });
                }
            }
        }

        // =================================================================================
        // TEMPLATE HTML
        // =================================================================================
        const renderWelcomeScreenHTML = () => `
            <div class="text-center animate-fade-in">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Selamat Datang!</h2>
                <p class="text-slate-600 mb-6">Silakan masukkan nama lengkap Anda untuk memulai tes.</p>
                <form id="name-form" class="flex flex-col items-center gap-4">
                    <input id="name-input" type="text" placeholder="Nama Lengkap" class="w-full max-w-sm px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition" required />
                    <button type="submit" class="w-full max-w-sm bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 active:bg-slate-900 transition-transform transform hover:scale-105">
                        Mulai Tes
                    </button>
                </form>
            </div>
        `;

        const renderInstructionScreenHTML = (playerName) => {
            const ruleItem = (icon, text) => `
                <li class="flex items-center gap-4 p-3 bg-slate-100 rounded-lg">
                    <div class="flex-shrink-0 text-slate-500">${icon}</div>
                    <span class="text-slate-700">${text}</span>
                </li>
            `;
            // Helper function to render a single example question block for instructions
            const renderExampleQuestionBlock = (contoh, soal, jawaban, options) => {
                return `
                    <div class="space-y-4 p-4 bg-white rounded-lg border-2 border-slate-300 text-center">
                        <div>
                            <p class="font-bold text-red-600">CONTOH LENGKAP</p>
                            <!-- Ukuran teks Contoh Lengkap diperkecil dan disamakan -->
                            <div class="mt-1 p-2 bg-white border-2 border-slate-800 text-2xl md:text-3xl font-mono tracking-[0.5em] inline-block rounded-lg shadow-md">${contoh}</div>
                        </div>
                        <div>
                            <p class="font-bold text-orange-500">SOAL</p>
                            <!-- Ukuran teks Soal diperkecil dan disamakan -->
                            <div class="mt-1 p-2 bg-white border-2 border-slate-800 text-2xl md:text-3xl font-mono tracking-[0.5em] inline-block rounded-lg shadow-md">${soal}</div>
                        </div>
                        <div class="w-full flex justify-center flex-wrap gap-3 pt-4">
                            ${options.map(option => `
                                <!-- Ukuran tombol dan teks opsi diperkecil dan disamakan -->
                                <button class="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold border-2 border-slate-800 rounded-lg bg-white ${option === jawaban ? 'bg-green-100 border-green-500' : ''} shadow-lg pointer-events-none">${option}</button>
                            `).join('')}
                        </div>
                        <p class="text-lg text-slate-700 mt-4">Karakter yang hilang adalah: <span class="font-bold text-green-600">${jawaban}</span></p>
                        <p class="text-sm text-slate-600 italic">Karena '${jawaban}' adalah karakter yang ada pada 'CONTOH LENGKAP' namun tidak ada pada 'SOAL'.</p>
                    </div>
                `;
            };

            return `
            <div class="text-center animate-fade-in flex flex-col items-center">
                <h2 class="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                    Instruksi Tes Kecermatan, <span class="text-yellow-500">${playerName}</span>
                </h2>
                <p class="text-slate-600 mb-6 font-semibold">Harap baca instruksi berikut dengan seksama:</p>
                <div class="text-left w-full space-y-4 mb-8 bg-slate-100 p-6 rounded-lg shadow-inner">
                    <p class="font-bold text-slate-800">Tujuan Tes:</p>
                    <ul class="list-disc list-inside text-slate-700 space-y-2 ml-4">
                        <li>Mengukur kecepatan dan ketelitian Anda dalam memproses informasi visual.</li>
                    </ul>

                    <p class="font-bold text-slate-800">Cara Mengerjakan:</p>
                    <ul class="list-decimal list-inside text-slate-700 space-y-2 ml-4">
                        <li>Setiap soal akan menampilkan sebuah <strong class="font-bold text-red-600">'CONTOH LENGKAP'</strong> (serangkaian karakter) dan sebuah <strong class="font-bold text-orange-500">'SOAL'</strong> (serangkaian karakter yang mirip dengan contoh, namun ada satu karakter yang hilang).</li>
                        <li>Tugas Anda adalah menemukan <strong class="font-bold text-green-600">karakter yang hilang</strong> dari 'CONTOH LENGKAP' agar 'SOAL' menjadi lengkap kembali.</li>
                        <li>Pilih jawaban (karakter yang hilang) dari 5 opsi yang tersedia di bagian bawah.</li>
                        <li>Jawablah <strong class="font-bold">secepat dan seteliti mungkin</strong>.</li>
                    </ul>

                    <p class="font-bold text-slate-800">Contoh Pengerjaan:</p>
                    ${renderExampleQuestionBlock("XYZ98", "XZ98", "Y", ["K", "Y", "P", "Q", "Z"])}

                    <p class="font-bold text-slate-800">Struktur Tes:</p>
                    <ul class="list-disc list-inside text-slate-700 space-y-2 ml-4">
                        <li>Tes terdiri dari <strong class="font-bold text-slate-900">${TOTAL_ROUNDS} Ronde</strong>.</li>
                        <li>Setiap ronde berlangsung selama <strong class="font-bold text-slate-900">${ROUND_DURATION_SECONDS} detik</strong>.</li>
                        <li>Akan ada istirahat singkat <strong class="font-bold text-slate-900">${BREAK_DURATION_SECONDS} detik</strong> antar ronde.</li>
                    </ul>
                    <p class="text-slate-700 mt-4 italic">Perhatikan waktu dan pertahankan konsentrasi. Selamat mengerjakan!</p>
                </div>
                <button id="begin-test-btn" class="w-full max-w-sm bg-slate-800 text-white font-bold py-4 px-6 rounded-lg hover:bg-slate-700 active:bg-slate-900 transition-transform transform hover:scale-105 shadow-lg">
                    SAYA SIAP, MULAI TES
                </button>
            </div>
            `;
        };

        const renderPreTestCountdownScreenHTML = (timeLeft) => `
            <div class="text-center p-8 bg-blue-100 border-4 border-dashed border-blue-400 rounded-xl animate-fade-in">
                <h2 class="text-2xl font-bold text-slate-800">PERHATIAN!</h2>
                <p class="text-slate-600 mt-2 mb-4">Tes akan dimulai dalam:</p>
                <div id="pre-test-countdown-display" class="text-6xl font-bold text-slate-900 my-4">${timeLeft}</div>
                <svg class="animate-spin h-8 w-8 text-slate-800 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        `;
        
        const renderTestScreenHTML = (playerName) => `
            <div class="flex flex-col items-center">
              <div class="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 text-center mb-6 p-4 bg-slate-100 rounded-lg shadow-inner">
                <div class="sm:col-span-1 col-span-2 sm:text-left">
                  <p class="text-sm font-semibold text-slate-500">Peserta</p>
                  <p class="text-lg font-bold text-slate-800 truncate">${playerName}</p>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-500">Ronde</p>
                  <p id="round-info" class="text-lg font-bold text-slate-800">1 / ${TOTAL_ROUNDS}</p>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-500">Waktu</p>
                  <p id="timer-info" class="text-lg font-bold text-red-600">0:00</p>
                </div>
              </div>
        
              <div id="question-content-wrapper" class="w-full flex flex-col items-center space-y-6">
                <div id="example-container">
                    <p class="text-center font-bold text-red-600">CONTOH LENGKAP</p>
                    <!-- Ukuran teks Contoh Lengkap diperbesar dan disamakan -->
                    <div id="example-text" class="mt-1 p-4 bg-white border-2 border-slate-800 text-4xl md:text-5xl font-mono tracking-[0.5em] text-center rounded-lg shadow-md"></div>
                </div>
                <div id="question-container">
                    <p class="text-center font-bold text-orange-500">SOAL</p>
                    <!-- Ukuran teks Soal diperbesar dan disamakan -->
                    <div id="question-text" class="mt-1 p-4 bg-white border-2 border-slate-800 text-4xl md:text-5xl font-mono tracking-[0.5em] text-center rounded-lg shadow-md"></div>
                </div>
                <div id="options-container" class="w-full flex justify-center flex-wrap gap-3 pt-4">
                    <!-- Opsi jawaban akan dirender di sini -->
                </div>
                <div id="round-complete-message" class="hidden text-center p-8">
                    <h2 class="text-2xl font-bold text-slate-800">Ronde Selesai!</h2>
                    <p class="text-slate-600 mt-2">Anda telah menyelesaikan semua soal di ronde ini.</p>
                </div>
              </div>
              
              <div id="action-buttons" class="mt-8 pt-6 border-t border-slate-200 w-full flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button id="next-round-btn" class="w-full sm:w-auto px-6 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition">
                    Lanjut Ronde Berikutnya
                  </button>
                  <button id="end-test-btn" class="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition">
                    Akhiri Tes
                  </button>
              </div>
            </div>
        `;

        const renderBreakScreenHTML = (timeLeft) => `
            <div class="text-center p-8 bg-yellow-100 border-4 border-dashed border-yellow-400 rounded-xl animate-fade-in">
                <h2 class="text-2xl font-bold text-slate-800">ISTIRAHAT</h2>
                <p class="text-slate-600 mt-2">Ronde berikutnya akan dimulai dalam:</p>
                <div id="break-countdown-display" class="text-6xl font-bold text-slate-900 my-4">${timeLeft}</div>
                <svg class="animate-spin h-8 w-8 text-slate-800 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        `;

        const renderResultsScreenHTML = (playerName, results) => {
            const totalStats = results.reduce(
                (acc, round) => {
                    acc.answered += round.answered;
                    acc.correct += round.correct;
                    acc.incorrect += round.incorrect;
                    return acc;
                }, { answered: 0, correct: 0, incorrect: 0 }
            );

            const performanceReport = analyzePerformance(results);
            const levelColorClasses = {
                'Sangat Cepat': 'bg-blue-100 text-blue-800', 'Cepat': 'bg-blue-100 text-blue-800',
                'Sangat Teliti': 'bg-green-100 text-green-800', 'Teliti': 'bg-green-100 text-green-800',
                'Sangat Baik': 'bg-purple-100 text-purple-800', 'Baik': 'bg-purple-100 text-purple-800',
                'Sangat Stabil': 'bg-indigo-100 text-indigo-800', 'Cukup Stabil': 'bg-indigo-100 text-indigo-800',
                'Cukup': 'bg-yellow-100 text-yellow-800', 'Cukup Teliti': 'bg-yellow-100 text-yellow-800',
                'Perlu Ditingkatkan': 'bg-red-100 text-red-800', 'Kurang Stabil': 'bg-red-100 text-red-800',
                'N/A': 'bg-slate-100 text-slate-800',
            };
            const aspectCard = (title, aspect, icon) => `
                <div class="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-start gap-4">
                  <div class="flex-shrink-0 text-slate-500">${icon}</div>
                  <div>
                    <h4 class="font-bold text-slate-700">${title}</h4>
                    <span class="inline-block px-2 py-0.5 text-sm font-semibold rounded-full mt-1 mb-2 ${levelColorClasses[aspect.level] || 'bg-slate-100 text-slate-800'}">
                      ${aspect.level}
                    </span>
                    <p class="text-slate-600 text-sm">${aspect.description}</p>
                  </div>
                </div>
            `;
            
            const maxAnswered = Math.max(...results.map(r => r.answered), 1); 
            const numYAxisLabels = 5; 
            let yAxisLabelsHtml = '';
            for (let i = numYAxisLabels - 1; i >= 0; i--) { 
                const value = Math.round(maxAnswered * (i / (numYAxisLabels - 1)));
                yAxisLabelsHtml += `<span class="y-axis-label">${value}</span>`;
            }

            const chartHTML = `
                <div class="chart-container-with-yaxis" style="display: flex; align-items: flex-end; width: 100%; height: 300px;">
                    <div class="y-axis-labels-container">
                         ${yAxisLabelsHtml}
                    </div>
                    <div class="w-full h-full bg-slate-50/50 p-4 rounded-lg flex gap-2 border border-slate-200 relative overflow-hidden" style="flex-grow: 1;">
                        ${results.map(r => {
                            const currentRoundBarHeightPercent = (r.answered / maxAnswered) * 100;
                            
                            const correctPortionPercent = r.answered > 0 ? (r.correct / r.answered) * 100 : 0;
                            const incorrectPortionPercent = r.answered > 0 ? (r.incorrect / r.answered) * 100 : 0;

                            return `
                                <div class="flex-1 flex flex-col items-center justify-end">
                                    <div class="chart-bar-container w-full h-full flex flex-col justify-end">
                                        <div class="chart-bar" 
                                             title="Benar: ${r.correct}\nSalah: ${r.incorrect}"
                                             style="height: ${currentRoundBarHeightPercent}%; 
                                                    min-height: ${r.answered > 0 ? '5px' : '2px'};">
                                            <div class="bar-incorrect" 
                                                 style="height: ${incorrectPortionPercent}%; 
                                                        min-height: ${r.incorrect > 0 && incorrectPortionPercent > 0 ? '1px' : '0px'};"></div>
                                            <div class="bar-correct" 
                                                 style="height: ${correctPortionPercent}%; 
                                                        min-height: ${r.correct > 0 && correctPortionPercent > 0 ? '1px' : '0px'};"></div>
                                        </div>
                                    </div>
                                    <span class="text-xs font-medium text-slate-500 mt-2">R${r.round}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="flex justify-center items-center gap-6 mt-4 text-sm">
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-sm bg-green-600"></div><span>Benar</span></div>
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-sm bg-red-600"></div><span>Salah</span></div>
                </div>
            `;

            return `
            <div class="animate-fade-in">
                <h2 class="text-3xl font-extrabold text-slate-800 text-center mb-2">Hasil Tes</h2>
                <p class="text-center text-slate-600 text-lg mb-6">Peserta: <span class="font-bold">${playerName}</span></p>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center">
                    <div class="bg-slate-100 p-4 rounded-lg shadow-inner"><p class="text-sm font-semibold text-slate-500">Total Jawaban</p><p class="text-3xl font-bold text-slate-800">${totalStats.answered}</p></div>
                    <div class="bg-green-100 p-4 rounded-lg shadow-inner"><p class="text-sm font-semibold text-green-700">Jawaban Benar</p><p class="text-3xl font-bold text-green-600">${totalStats.correct}</p></div>
                    <div class="bg-red-100 p-4 rounded-lg shadow-inner"><p class="text-sm font-semibold text-red-700">Jawaban Salah</p><p class="text-3xl font-bold text-red-600">${totalStats.incorrect}</p></div>
                </div>
                
                <div class="my-8">
                   <h3 class="text-xl font-bold text-slate-700 text-center mb-4">Analisis Kinerja Psikologis</h3>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${aspectCard('Kecepatan (Speed)', performanceReport.speed, '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>')}
                        ${aspectCard('Ketelitian (Accuracy)', performanceReport.accuracy, '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>')}
                        ${aspectCard('Daya Tahan (Endurance)', performanceReport.endurance, '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.69v4.99" /></svg>')}
                        ${aspectCard('Konsistensi (Consistency)', performanceReport.consistency, '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-12a2.25 2.25 0 01-2.25-2.25V3z" /></svg>')}
                   </div>
                </div>

                <div class="mb-8">
                  <h3 class="text-xl font-bold text-slate-700 text-center mb-4">Grafik Hasil per Ronde</h3>
                  ${chartHTML}
                </div>

                <div class="mb-8">
                    <h3 class="text-xl font-bold text-slate-700 text-center mb-4">Detail per Ronde</h3>
                    <div class="overflow-x-auto rounded-lg border border-slate-200"><table class="min-w-full divide-y divide-slate-200 text-center"><thead class="bg-slate-100"><tr><th class="px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">Ronde</th><th class="px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">Jumlah</th><th class="px-6 py-3 text-xs font-medium text-green-700 uppercase tracking-wider">Benar</th><th class="px-6 py-3 text-xs font-medium text-red-700 uppercase tracking-wider">Salah</th></tr></thead><tbody class="bg-white divide-y divide-slate-200">
                        ${results.map(r => `<tr><td class="px-6 py-4 whitespace-nowrap font-medium text-slate-800">${r.round}</td><td class="px-6 py-4 whitespace-nowrap font-medium text-slate-800">${r.answered}</td><td class="px-6 py-4 whitespace-nowrap font-medium text-green-600">${r.correct}</td><td class="px-6 py-4 whitespace-nowrap font-medium text-red-600">${r.incorrect}</td></tr>`).join('')}
                    </tbody></table></div>
                </div>
                
                <div class="text-center">
                    <button id="restart-btn" class="bg-slate-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-700 active:bg-slate-900 transition-transform transform hover:scale-105">
                        Coba Lagi
                    </button>
                </div>
            </div>
            `;
        };

        // =================================================================================
        // LOGIKA & STATE APLIKASI
        // =================================================================================
        let gameState = 'welcome'; 
        let playerName = '';
        let finalResults = [];
        let testLogicInstance = null; 
        let lastRenderedQuestionSoal = null; 
        let breakCountdownElement = null; 
        let optionsContainerClickHandler = null; 

        let preTestCountdownTimeLeft = PRE_TEST_COUNTDOWN_SECONDS; 
        let preTestCountdownTimerId = null; 
        let preTestCountdownDisplayElement = null; 

        const appContainer = document.getElementById('app-container');

        const handleStartTest = (name) => {
            playerName = name;
            gameState = 'instructions'; 
            renderApp();
        };

        const handleBeginTest = () => {
            gameState = 'pre-test-countdown';
            finalResults = []; 
            renderApp(); 
            startPreTestCountdown(); 
        };

        const startPreTestCountdown = () => {
            preTestCountdownTimeLeft = PRE_TEST_COUNTDOWN_SECONDS; 

            preTestCountdownTimerId = setInterval(() => {
                preTestCountdownTimeLeft--;
                if (preTestCountdownDisplayElement) {
                    preTestCountdownDisplayElement.textContent = preTestCountdownTimeLeft;
                }

                if (preTestCountdownTimeLeft <= 0) {
                    clearInterval(preTestCountdownTimerId);
                    preTestCountdownTimerId = null; 
                    preTestCountdownDisplayElement = null; 
                    
                    gameState = 'test'; 
                    testLogicInstance = new TestLogic(onUpdate, handleFinishTest, onBreakStart, onBreakEnd);
                    testLogicInstance.startTest(); 
                }
            }, 1000);
        };

        const handleFinishTest = (results) => {
            finalResults = results;
            gameState = 'results';
            if (testLogicInstance) {
                testLogicInstance.stopTimers();
            }
            if (preTestCountdownTimerId) { 
                clearInterval(preTestCountdownTimerId);
                preTestCountdownTimerId = null;
            }
            testLogicInstance = null; 
            renderApp();
        };

        const handleRestart = () => {
            playerName = '';
            finalResults = [];
            gameState = 'welcome';
            if (testLogicInstance) {
                testLogicInstance.stopTimers();
            }
            if (preTestCountdownTimerId) { 
                clearInterval(preTestCountdownTimerId);
                preTestCountdownTimerId = null;
            }
            testLogicInstance = null; 
            lastRenderedQuestionSoal = null; 
            breakCountdownElement = null; 
            optionsContainerClickHandler = null; 
            preTestCountdownTimeLeft = PRE_TEST_COUNTDOWN_SECONDS; 
            renderApp();
        };

        const onUpdate = ({ timeLeft, currentRound, currentQuestion }) => {
            const timerInfoElement = document.getElementById('timer-info');
            const roundInfoElement = document.getElementById('round-info');
            const exampleTextElement = document.getElementById('example-text');
            const questionTextElement = document.getElementById('question-text');
            const optionsContainerElement = document.getElementById('options-container');
            const questionContentWrapper = document.getElementById('question-content-wrapper');
            const roundCompleteMessage = document.getElementById('round-complete-message');

            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            if (timerInfoElement) timerInfoElement.textContent = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
            if (roundInfoElement) roundInfoElement.textContent = `${currentRound + 1} / ${TOTAL_ROUNDS}`;

            if (currentQuestion && currentQuestion.soal !== lastRenderedQuestionSoal) {
                if (roundCompleteMessage) roundCompleteMessage.classList.add('hidden');
                if (questionContentWrapper) questionContentWrapper.style.display = 'flex'; 

                if (exampleTextElement) exampleTextElement.textContent = currentQuestion.contoh;
                if (questionTextElement) questionTextElement.textContent = currentQuestion.soal;

                if (optionsContainerElement) {
                    optionsContainerElement.innerHTML = currentQuestion.options.map(option => `
                        <button data-answer="${option}" class="option-btn w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold border-2 border-slate-800 rounded-lg bg-white hover:bg-yellow-200 transition-all duration-150 transform hover:scale-110 active:scale-100 shadow-lg">${option}</button>
                    `).join('');
                }
                lastRenderedQuestionSoal = currentQuestion.soal; 
            } else if (!currentQuestion && lastRenderedQuestionSoal !== 'round-finished') {
                if (questionContentWrapper) questionContentWrapper.style.display = 'none'; 
                if (roundCompleteMessage) roundCompleteMessage.classList.remove('hidden'); 
                lastRenderedQuestionSoal = 'round-finished'; 
            }
        };

        const onBreakStart = (timeLeft) => {
            if (gameState !== 'break') {
                appContainer.innerHTML = renderBreakScreenHTML(timeLeft);
                breakCountdownElement = document.getElementById('break-countdown-display');
                gameState = 'break'; 
            }
            if (breakCountdownElement) {
                breakCountdownElement.textContent = timeLeft;
            }
        };
        
        const onBreakEnd = () => {
            gameState = 'test'; 
            renderApp(); 
            lastRenderedQuestionSoal = null; 
            breakCountdownElement = null; 
        };

        const renderApp = () => {
            appContainer.innerHTML = ''; 

            switch (gameState) {
                case 'welcome':
                    appContainer.innerHTML = renderWelcomeScreenHTML();
                    document.getElementById('name-form').addEventListener('submit', (e) => {
                        e.preventDefault();
                        const nameInput = document.getElementById('name-input');
                        if (nameInput.value.trim()) {
                            handleStartTest(nameInput.value.trim());
                        }
                    });
                    break;
                case 'instructions': 
                    appContainer.innerHTML = renderInstructionScreenHTML(playerName);
                    document.getElementById('begin-test-btn').addEventListener('click', handleBeginTest);
                    break;
                case 'pre-test-countdown': 
                    appContainer.innerHTML = renderPreTestCountdownScreenHTML(preTestCountdownTimeLeft);
                    preTestCountdownDisplayElement = document.getElementById('pre-test-countdown-display');
                    break;
                case 'test':
                    appContainer.innerHTML = renderTestScreenHTML(playerName);

                    const optionsContainerElement = document.getElementById('options-container');

                    if (optionsContainerElement && optionsContainerClickHandler) {
                        optionsContainerElement.removeEventListener('click', optionsContainerClickHandler);
                    }

                    optionsContainerClickHandler = (e) => {
                        const clickedBtn = e.target.closest('.option-btn'); 
                        if (clickedBtn && testLogicInstance) { 
                            testLogicInstance.handleAnswer(clickedBtn.dataset.answer);
                        }
                    };

                    if (optionsContainerElement) {
                        optionsContainerElement.addEventListener('click', optionsContainerClickHandler);
                    }

                    const nextRoundBtn = document.getElementById('next-round-btn');
                    const endTestBtn = document.getElementById('end-test-btn');
                    if (nextRoundBtn) {
                        nextRoundBtn.addEventListener('click', () => {
                            if (testLogicInstance) testLogicInstance.endRound();
                        });
                    }
                    if (endTestBtn) {
                        endTestBtn.addEventListener('click', () => {
                            if (testLogicInstance) testLogicInstance.endTestManually();
                        });
                    }
                    
                    if (testLogicInstance) {
                        testLogicInstance.onUpdate({
                            timeLeft: testLogicInstance.timeLeft,
                            currentRound: testLogicInstance.currentRound,
                            currentQuestion: testLogicInstance.questions[testLogicInstance.currentQuestionIndex]
                        });
                    }
                    break;
                case 'results':
                    appContainer.innerHTML = renderResultsScreenHTML(playerName, finalResults);
                    document.getElementById('restart-btn').addEventListener('click', handleRestart);
                    break;
                case 'break':
                    break;
            }
        };

// ... dan seterusnya, seluruh fungsi JavaScript ...

// =================================================================================
// INISIALISASI
// =================================================================================
// INISIALISASI YANG LEBIH AMAN
// Menunggu seluruh elemen HTML dimuat oleh browser sebelum menjalankan JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Baru setelah semuanya siap, panggil fungsi untuk memulai aplikasi.
    renderApp();
});

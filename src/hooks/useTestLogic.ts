import { useState, useEffect, useCallback, useMemo } from 'react';
import { RoundResult } from '@/types';
import { TOTAL_ROUNDS, ROUND_DURATION_SECONDS, BREAK_DURATION_SECONDS, EXAMPLE_TEMPLATES, NUM_QUESTIONS_PER_ROUND, NUM_OPTIONS } from '@/constants';

// Utility function to shuffle an array
const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface Question {
  soal: string;
  jawaban: string;
  contoh: string;
  options: string[];
}

export const useTestLogic = (onFinishTest: (results: RoundResult[]) => void) => {
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION_SECONDS);
  const [breakTimeLeft, setBreakTimeLeft] = useState(BREAK_DURATION_SECONDS);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [roundStats, setRoundStats] = useState({ correct: 0, incorrect: 0 });
  const [allRoundResults, setAllRoundResults] = useState<RoundResult[]>([]);

  const generateQuestionsForRound = useCallback((roundIndex: number) => {
    const template = EXAMPLE_TEMPLATES[roundIndex % EXAMPLE_TEMPLATES.length];
    const generatedQuestions: Question[] = [];
    
    for (let i = 0; i < NUM_QUESTIONS_PER_ROUND; i++) {
      const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      
      const missingIndex = Math.floor(Math.random() * template.length);
      const jawaban = template[missingIndex];
      const soalArray = template.split('');
      soalArray.splice(missingIndex, 1);
      const soal = shuffle(soalArray).join('');

      const optionsSet = new Set<string>([jawaban]);
      while (optionsSet.size < NUM_OPTIONS) {
        const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
        if (!template.includes(randomChar)) {
             optionsSet.add(randomChar);
        }
      }
      generatedQuestions.push({ soal, jawaban, contoh: template, options: shuffle(Array.from(optionsSet)) });
    }
    setQuestions(generatedQuestions);
  }, []);

  const startTest = useCallback(() => {
    setAllRoundResults([]);
    // The setup for round 0 will be handled by the `useEffect` listening to `currentRound`
    setIsActive(true);
    setIsBreak(false);
    setCurrentRound(0);
  }, []);

  const endRound = useCallback(() => {
    const newResults: RoundResult = {
      round: currentRound + 1,
      answered: roundStats.correct + roundStats.incorrect,
      correct: roundStats.correct,
      incorrect: roundStats.incorrect,
    };
    const updatedResults = [...allRoundResults, newResults];
    setAllRoundResults(updatedResults);

    if (currentRound + 1 >= TOTAL_ROUNDS) {
      setIsActive(false);
      onFinishTest(updatedResults);
    } else {
      setIsBreak(true);
      setBreakTimeLeft(BREAK_DURATION_SECONDS);
    }
  }, [currentRound, roundStats, allRoundResults, onFinishTest]);

  const endTestManually = useCallback(() => {
    setIsActive(false);
    setIsBreak(false);
     const newResults: RoundResult = {
      round: currentRound + 1,
      answered: roundStats.correct + roundStats.incorrect,
      correct: roundStats.correct,
      incorrect: roundStats.incorrect,
    };
    const finalResults = [...allRoundResults, newResults];
    onFinishTest(finalResults);
  }, [currentRound, roundStats, allRoundResults, onFinishTest]);

  // Round Timer - separated logic to prevent reset on answer click
  useEffect(() => {
    // This effect is only for decrementing the timer.
    if (!isActive || isBreak) return;

    const timerId = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isActive, isBreak]); // Dependencies are stable during a round.

  // Effect to end the round when time is up.
  useEffect(() => {
    if (timeLeft <= 0 && isActive && !isBreak) {
      endRound();
    }
  }, [timeLeft, isActive, isBreak, endRound]); // This can re-run, but it won't clear the interval.
  
  // Break Timer
  useEffect(() => {
    if (!isBreak) return;
    if (breakTimeLeft <= 0) {
      // When break ends, just increment the round. The next `useEffect` will handle the setup.
      setCurrentRound(r => r + 1);
      return;
    }
    const timerId = setInterval(() => setBreakTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [isBreak, breakTimeLeft]);

  // New round setup
  useEffect(() => {
    // This effect runs to set up the current round's state.
    // It's triggered when the test starts or the round number changes.
    if (isActive) {
        generateQuestionsForRound(currentRound);
        setCurrentQuestionIndex(0);
        setRoundStats({ correct: 0, incorrect: 0 });
        setTimeLeft(ROUND_DURATION_SECONDS);
        // This is the key: we transition out of the break state here, after setup.
        setIsBreak(false);
    }
  }, [currentRound, isActive, generateQuestionsForRound]);

  const handleAnswer = useCallback((selectedAnswer: string) => {
    if (isBreak) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer.toUpperCase() === currentQuestion.jawaban.toUpperCase()) {
      setRoundStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setRoundStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
    setCurrentQuestionIndex(prev => prev + 1);
  }, [isBreak, questions, currentQuestionIndex]);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex] || null, [questions, currentQuestionIndex]);

  return {
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
  };
};
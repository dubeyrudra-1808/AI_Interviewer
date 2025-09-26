'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InterviewTimerProps {
  className?: string;
  sessionStarted?: boolean;
}

type InterviewPhase = 'introduction' | 'dsa' | 'coding' | 'systemDesign' | 'feedback' | 'completed';

export const InterviewTimer = ({ className, sessionStarted = false }: InterviewTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [currentPhase, setCurrentPhase] = useState<InterviewPhase>('introduction');
  const [showCodingWindow, setShowCodingWindow] = useState(false);
  const [codingAnswer, setCodingAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const phases = [
    {
      id: 'introduction',
      name: 'Introduction',
      duration: 1, // 1 min
      description: 'Behavioral & Background',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'dsa',
      name: 'DSA Concepts',
      duration: 3, // 3 mins
      description: 'Data Structures & Algorithms',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'coding',
      name: 'Live Coding',
      duration: 4, // 4 mins
      description: 'Practical Coding Challenge',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      id: 'systemDesign',
      name: 'System Design',
      duration: 1, // 1 min
      description: 'High-Level Architecture',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'feedback',
      name: 'Feedback & Score',
      duration: 1, // 1 min
      description: 'Final Results & Feedback',
      color: 'from-purple-500 to-purple-600',
    }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentPhaseInfo = () => {
    return phases.find(phase => phase.id === currentPhase) || phases[0];
  };

  const getProgressPercentage = () => {
    return ((10 * 60 - timeLeft) / (10 * 60)) * 100;
  };

  useEffect(() => {
    if (sessionStarted && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          
          // Update phase based on a 10-minute interview format
          if (newTime > 9 * 60) {
            // 0-1 min: Introduction
            setCurrentPhase('introduction');
          } else if (newTime > 6 * 60) {
            // 1-4 min: DSA Concepts
            setCurrentPhase('dsa');
          } else if (newTime > 2 * 60) {
            // 4-8 min: Live Coding
            setCurrentPhase('coding');
            if (prev === 6 * 60) { // Show window at the start of this phase
              setShowCodingWindow(true);
            }
          } else if (newTime > 1 * 60) {
            // 8-9 min: System Design
            setCurrentPhase('systemDesign');
             if (prev === 2 * 60) { // Hide window at the end of the coding phase
              setShowCodingWindow(false);
            }
          } else if (newTime > 0) {
            // 9-10 min: Feedback
            setCurrentPhase('feedback');
            if (prev === 1 * 60) {
              generateScoreAndFeedback();
            }
          } else {
            // 0 min: Completed
            setCurrentPhase('completed');
            generateScoreAndFeedback();
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionStarted, timeLeft]);

  const generateScoreAndFeedback = () => {
    // Simulate scoring based on coding answer
    const baseScore = Math.floor(Math.random() * 30) + 60; // 60-90 base
    const codingBonus = (codingAnswer.toLowerCase().includes('map') || codingAnswer.toLowerCase().includes('for')) && codingAnswer.toLowerCase().includes('return') ? 10 : 0;
    const finalScore = Math.min(100, baseScore + codingBonus);
    
    setScore(finalScore);
    
    const feedbacks = [
      "Excellent problem-solving skills and clean code. Strong grasp of fundamental data structures.",
      "Good approach to the problem. Consider optimizing your solution and discussing time/space complexity.",
      "Solid coding foundation. Focus on handling edge cases and writing more descriptive variable names.",
      "A good starting point. Recommend practicing more DSA problems to improve speed and efficiency."
    ];
    
    setFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
  };

  if (!sessionStarted) return null;

  const currentPhaseInfo = getCurrentPhaseInfo();

  return (
    <>
      {/* Timer in Top Right Corner */}
      <div className="fixed top-6 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 min-w-[200px]"
        >
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-slate-800 dark:text-slate-100 mb-1">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              {currentPhaseInfo.name}
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
              <motion.div
                className={cn('h-1 rounded-full bg-gradient-to-r', currentPhaseInfo.color)}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Coding Challenge Window */}
      <AnimatePresence>
        {showCodingWindow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-4 z-40 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Live Coding Challenge
              </h3>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-4 border border-indigo-200 dark:border-indigo-700">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Problem: Two Sum
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.
                <br />
                You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.
              </p>
              <div className="mt-3 space-y-1 text-sm bg-slate-100 dark:bg-slate-900/50 p-3 rounded-md font-mono">
                <p><strong>Example:</strong></p>
                <p><strong>Input:</strong> nums = [2, 7, 11, 15], target = 9</p>
                <p><strong>Output:</strong> [0, 1]</p>
                <p><strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Your Solution (JavaScript/Python/etc.):
              </label>
              <textarea
                value={codingAnswer}
                onChange={(e) => setCodingAnswer(e.target.value)}
                placeholder={`function twoSum(nums, target) {\n  // Your code here\n}`}
                className="w-full h-48 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Window */}
      <AnimatePresence>
        {(currentPhase === 'feedback' || currentPhase === 'completed') && score > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-4 z-40 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Interview Results
              </h3>
              <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {score}/100
              </div>
              <div className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                Overall Score
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 text-left">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Feedback:
                </h4>
                <p className="text-slate-700 dark:text-slate-300">
                  {feedback}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
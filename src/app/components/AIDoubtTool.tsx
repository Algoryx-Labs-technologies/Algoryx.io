import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowUp, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';

interface QAPair {
  question: string;
  answer: string;
  keyForecast?: {
    metric: string;
    baseline: string;
    change: string;
  }[];
}

const qaPairs: QAPair[] = [
  {
    question: 'What is the difference between Sharpe ratio and Sortino ratio?',
    answer: 'Sharpe uses total volatility; Sortino only considers downside volatility. Sortino is better for strategies where upside moves are desirable, as it only penalizes harmful volatility.',
    keyForecast: [
      { metric: 'Risk Measure', baseline: 'Total Volatility', change: 'Downside Only' },
      { metric: 'Use Case', baseline: 'General Strategies', change: 'Asymmetric Returns' },
      { metric: 'Penalty', baseline: 'All Volatility', change: 'Downside Only' },
    ],
  },
  {
    question: 'How do I implement a mean reversion strategy in Python?',
    answer: 'Calculate rolling mean and std, compute z-scores: (price - mean) / std. Generate signals when z-score exceeds ±2. Enter long when oversold, short when overbought. Use pandas for calculations.',
    keyForecast: [
      { metric: 'Z-Score Threshold', baseline: '±1.5', change: '±2.0' },
      { metric: 'Lookback Period', baseline: '20 days', change: '30 days' },
      { metric: 'Success Rate', baseline: '65%', change: '72%' },
    ],
  },
  {
    question: 'What is the optimal position sizing for a portfolio?',
    answer: 'Use fractional Kelly (25-50% of full Kelly) to balance risk and return. Kelly formula: f = (bp - q) / b. Alternatively, use risk parity or volatility targeting for more stable allocation.',
    keyForecast: [
      { metric: 'Kelly Fraction', baseline: '100%', change: '25-50%' },
      { metric: 'Risk Per Trade', baseline: '2%', change: '1-2%' },
      { metric: 'Max Drawdown', baseline: '15%', change: '8%' },
    ],
  },
  {
    question: 'How do I handle regime changes in algorithmic trading?',
    answer: 'Detect regimes using HMM or volatility clustering. Adapt by switching strategy parameters, using ensemble models weighted by regime, and implementing regime-aware risk management. Monitor VIX and yield curves.',
    keyForecast: [
      { metric: 'Regime Detection', baseline: 'Manual', change: 'HMM Automated' },
      { metric: 'Strategy Adaptation', baseline: 'Static', change: 'Dynamic' },
      { metric: 'Performance', baseline: '60%', change: '78%' },
    ],
  },
];

export function AIDoubtTool() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [displayedAnswer, setDisplayedAnswer] = useState('');
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const answerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notificationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // IntersectionObserver to trigger animation on scroll
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setShouldAnimate(true);
          setHasAnimated(true);
          // Trigger entrance animation only once
          if (!hasEntered) {
            setHasEntered(true);
          }
        } else if (!entry.isIntersecting && hasAnimated) {
          setShouldAnimate(false);
        } else if (entry.isIntersecting && hasAnimated) {
          setShouldAnimate(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px',
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  // Main loop for questions and answers
  useEffect(() => {
    if (!shouldAnimate) {
      if (answerIntervalRef.current) {
        clearInterval(answerIntervalRef.current);
        answerIntervalRef.current = null;
      }
      setIsThinking(false);
      setDisplayedAnswer('');
      return;
    }

    let isMounted = true;
    let typingTimeout: ReturnType<typeof setTimeout> | null = null;
    let cycleTimeout: ReturnType<typeof setTimeout> | null = null;

    const startCycle = () => {
      if (!isMounted) return;

      const currentQA = qaPairs[currentIndex];

      // Reset state - show question
      setIsThinking(false);
      setDisplayedAnswer('');

      // After 2 seconds, show "Thinking..."
      setTimeout(() => {
        if (!isMounted) return;
        setIsThinking(true);
        setDisplayedAnswer('');
      }, 2000);

      // After 3 more seconds (5s total), start typing answer
      setTimeout(() => {
        if (!isMounted) return;
        setIsThinking(false);
        let charIndex = 0;
        const answerText = currentQA.answer;

        const typeAnswer = () => {
          if (!isMounted) return;
          if (charIndex < answerText.length) {
            setDisplayedAnswer(answerText.slice(0, charIndex + 1));
            charIndex++;
            typingTimeout = setTimeout(typeAnswer, 30); // Typing speed
          } else {
            // Answer complete, wait 4 seconds then move to next question
            cycleTimeout = setTimeout(() => {
              if (!isMounted) return;
              setCurrentIndex((prev) => (prev + 1) % qaPairs.length);
            }, 4000); // Show answer for 4 seconds
          }
        };

        typeAnswer();
      }, 5000);
    };

    // Start the cycle for current question
    startCycle();

    return () => {
      isMounted = false;
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      if (cycleTimeout) {
        clearTimeout(cycleTimeout);
      }
    };
  }, [shouldAnimate, currentIndex]);

  // Notification animation - show every 10 seconds, visible for 2 seconds (8 second gap)
  useEffect(() => {
    if (!shouldAnimate || !hasEntered) {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
        notificationIntervalRef.current = null;
      }
      setShowNotification(false);
      return;
    }

    let isMounted = true;

    const showNotif = () => {
      if (!isMounted) return;
      setShowNotification(true);
      
      // Hide after 2 seconds
      setTimeout(() => {
        if (isMounted) {
          setShowNotification(false);
        }
      }, 2000);
    };

    // Show first notification after 2 seconds
    const initialTimeout = setTimeout(() => {
      if (isMounted) {
        showNotif();
      }
    }, 2000);

    // Then show every 10 seconds (2s visible + 8s gap = 10s total)
    notificationIntervalRef.current = setInterval(() => {
      if (isMounted) {
        showNotif();
      }
    }, 10000);

    return () => {
      isMounted = false;
      clearTimeout(initialTimeout);
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
        notificationIntervalRef.current = null;
      }
    };
  }, [shouldAnimate, hasEntered]);

  const currentQA = qaPairs[currentIndex];

  return (
    <section ref={sectionRef} className="py-12 md:py-16 relative">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 italic">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                AI-Powered Quant Assistant
              </span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto italic">
              Get instant, personalized answers to your quant finance doubts.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -100, rotate: -180 }}
            animate={
              hasEntered
                ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
                : { opacity: 0, scale: 0.8, y: -100, rotate: -180 }
            }
            transition={{ 
              duration: 1.2, 
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="relative"
          >
            {/* iPhone Frame - Reduced size */}
            <div className="relative w-[280px] h-[560px] md:w-[320px] md:h-[640px] mx-auto scale-90 md:scale-100">
              {/* iPhone Outer Frame with ultra-minimal bezel */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-[2.5rem] p-[1px] shadow-[0_0_40px_rgba(0,0,0,0.8),0_20px_60px_rgba(0,0,0,0.6)]">
                {/* Inner screen - true edge to edge */}
                <div className="w-full h-full bg-black rounded-[2.4rem] overflow-hidden relative">
                  {/* Minimal Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-28 h-4 md:h-5 bg-black rounded-b-lg md:rounded-b-xl z-20">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-black rounded-b-lg md:rounded-b-xl"></div>
                  </div>

                  {/* Status Bar - Edge to edge */}
                  <div className="absolute top-1 md:top-1.5 left-0 right-0 flex justify-between items-center px-4 md:px-6 z-10">
                    <span className="text-white text-[10px] md:text-xs font-semibold">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-1.5 md:w-4 md:h-2 border border-white/90 rounded-sm">
                        <div className="w-3/4 h-full bg-white rounded-sm"></div>
                      </div>
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                  </div>

                  {/* iPhone Notification - Just below status bar */}
                  <AnimatePresence>
                    {showNotification && (
                      <motion.div
                        initial={{ y: -60, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -60, opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        className="absolute top-6 md:top-7 left-2 right-2 z-50"
                      >
                        <div className="bg-white/95 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
                          <div className="px-3 md:px-4 py-2 md:py-2.5">
                            <div className="flex items-center gap-2.5 md:gap-3">
                              {/* App Icon */}
                              <div className="w-7 h-7 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Sparkles className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-white" />
                              </div>
                              {/* Notification Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <p className="text-black text-[10px] md:text-xs font-semibold">Alryx AI</p>
                                  <p className="text-gray-500 text-[9px] md:text-[10px]">now</p>
                                </div>
                                <p className="text-gray-800 text-[10px] md:text-xs leading-tight font-medium">Coming Soon</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* App Content - Full screen */}
                  <div className="pt-8 h-full bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-hidden flex flex-col">
                    {/* Header with Logo */}
                    <div className="flex flex-col items-center pt-4 pb-3 px-4 flex-shrink-0">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="mb-2"
                      >
                        <Sparkles className="w-7 h-7 md:w-9 md:h-9 text-blue-400" />
                      </motion.div>
                      <h1 className="text-xl md:text-2xl font-serif text-white mb-1">Ask anything</h1>
                      <p className="text-[10px] md:text-xs text-gray-400 text-center px-2 md:px-3">
                      We turn your curiosity into answers you can trust.                      
                      </p>
                    </div>

                    {/* Chat Area - No scrolling, fixed height */}
                    <div className="flex-1 px-3 md:px-4 pb-20 md:pb-24 overflow-hidden min-h-0 flex flex-col">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2 md:space-y-3 flex-1 flex flex-col justify-start"
                        >
                          {/* Question */}
                          <div className="bg-slate-800/50 rounded-xl md:rounded-2xl p-2.5 md:p-3 border border-white/10 flex-shrink-0">
                            <p className="text-white text-xs md:text-sm leading-tight">{currentQA.question}</p>
                          </div>

                          {/* Thinking or Answer */}
                          {isThinking ? (
                            <div className="flex items-center gap-2 text-purple-400 pl-2 flex-shrink-0">
                              <Sparkles className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                              <span className="text-xs md:text-sm">Thinking...</span>
                            </div>
                          ) : displayedAnswer ? (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-slate-800/70 rounded-xl md:rounded-2xl p-2.5 md:p-3 border border-white/10 flex-shrink-0"
                            >
                              <p className="text-white text-xs md:text-sm leading-tight mb-2 md:mb-3">
                                {displayedAnswer}
                                {displayedAnswer.length < currentQA.answer.length && (
                                  <span className="inline-block w-0.5 h-3 md:h-4 bg-white ml-1 animate-pulse"></span>
                                )}
                              </p>

                              {/* Key Forecast Changes */}
                              {currentQA.keyForecast && displayedAnswer.length === currentQA.answer.length && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  transition={{ delay: 0.3 }}
                                  className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/10"
                                >
                                  <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                                    <RefreshCw className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                                    <h3 className="text-[10px] md:text-xs font-semibold text-white">Key Forecast Changes</h3>
                                  </div>
                                  <div className="space-y-1 md:space-y-1.5">
                                    {currentQA.keyForecast.map((forecast, idx) => (
                                      <div
                                        key={idx}
                                        className="flex justify-between items-center text-[9px] md:text-[10px]"
                                      >
                                        <span className="text-gray-400 truncate pr-2">{forecast.metric}</span>
                                        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                                          <span className="text-gray-500">{forecast.baseline}</span>
                                          <span className="text-blue-400">{forecast.change}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </motion.div>
                          ) : null}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Input Area - Fixed at bottom, edge to edge */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 pb-4 md:pb-5 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 bg-slate-800/70 rounded-xl md:rounded-2xl px-3 md:px-4 py-2.5 md:py-3 border border-white/10 min-w-0">
                          <p className="text-gray-400 text-xs md:text-sm leading-snug break-words line-clamp-2">{currentQA.question}</p>
                        </div>
                        <button className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg flex-shrink-0 mt-0.5">
                          <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Minimal Home Indicator */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 md:w-36 h-0.5 bg-white/40 rounded-full z-30"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


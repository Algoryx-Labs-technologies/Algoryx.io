import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Code2, TrendingUp, Calculator } from 'lucide-react';
import { EducationDashboard, EducationVideos, EducationCourses, EducationBacktesting } from './EducationDashboard';

export function EducationDemo() {
  // Track if animation should run (triggered on scroll)
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Code execution animation
  const [activeLine, setActiveLine] = useState(0);

  // Animated values for formulas
  const [formulaValues, setFormulaValues] = useState({
    sharpe: 1.85,
    returns: 24.5,
    volatility: 13.2
  });

  // Gaming PC ref
  const gamingPCRef = useRef<HTMLDivElement>(null);
  const [gamingPCOffset, setGamingPCOffset] = useState(0);

  // Terminal output lines
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminalOffset, setTerminalOffset] = useState(0);
  
  // Store interval refs for proper cleanup
  const executionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const formulaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const terminalIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const terminalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const windowSwitchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Window switching state
  const [activeWindow, setActiveWindow] = useState<'dashboard' | 'videos' | 'courses' | 'backtesting'>('dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // IntersectionObserver to trigger animation on scroll and track visibility
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
          // Stop animations when component is not visible
          setShouldAnimate(false);
        } else if (entry.isIntersecting && hasAnimated) {
          // Resume animations when component becomes visible again
          setShouldAnimate(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px'
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  // Code line animation
  useEffect(() => {
    if (!shouldAnimate) {
      if (executionIntervalRef.current) {
        clearInterval(executionIntervalRef.current);
        executionIntervalRef.current = null;
      }
      return;
    }
    
    let isMounted = true;
    
    executionIntervalRef.current = setInterval(() => {
      if (!isMounted) {
        if (executionIntervalRef.current) {
          clearInterval(executionIntervalRef.current);
          executionIntervalRef.current = null;
        }
        return;
      }
      setActiveLine(prev => (prev + 1) % 11);
    }, 2000);
    
    return () => {
      isMounted = false;
      if (executionIntervalRef.current) {
        clearInterval(executionIntervalRef.current);
        executionIntervalRef.current = null;
      }
    };
  }, [shouldAnimate]);

  // Animate formula values
  useEffect(() => {
    if (!shouldAnimate) {
      if (formulaIntervalRef.current) {
        clearInterval(formulaIntervalRef.current);
        formulaIntervalRef.current = null;
      }
      return;
    }
    
    let isMounted = true;
    
    formulaIntervalRef.current = setInterval(() => {
      if (!isMounted) {
        if (formulaIntervalRef.current) {
          clearInterval(formulaIntervalRef.current);
          formulaIntervalRef.current = null;
        }
        return;
      }
      setFormulaValues(prev => ({
        sharpe: Math.max(1.5, Math.min(2.2, prev.sharpe + (Math.random() * 0.1 - 0.05))),
        returns: Math.max(22, Math.min(27, prev.returns + (Math.random() * 0.3 - 0.15))),
        volatility: Math.max(12, Math.min(15, prev.volatility + (Math.random() * 0.2 - 0.1)))
      }));
    }, 3000);
    
    return () => {
      isMounted = false;
      if (formulaIntervalRef.current) {
        clearInterval(formulaIntervalRef.current);
        formulaIntervalRef.current = null;
      }
    };
  }, [shouldAnimate]);

  // Calculate gaming PC offset (25% of its width)
  useEffect(() => {
    const calculateOffset = () => {
      if (gamingPCRef.current) {
        const width = gamingPCRef.current.offsetWidth;
        setGamingPCOffset(width * 0.25);
      }
    };
    
    calculateOffset();
    
    if (shouldAnimate) {
      const timer = setTimeout(calculateOffset, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  // Calculate terminal offset (25% of its width)
  useEffect(() => {
    const calculateOffset = () => {
      if (terminalRef.current) {
        const width = terminalRef.current.offsetWidth;
        setTerminalOffset(width * 0.25);
      }
    };
    
    calculateOffset();
    
    if (shouldAnimate) {
      const timer = setTimeout(calculateOffset, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  // Terminal output animation
  useEffect(() => {
    if (!shouldAnimate) {
      if (terminalIntervalRef.current) {
        clearInterval(terminalIntervalRef.current);
        terminalIntervalRef.current = null;
      }
      if (terminalTimeoutRef.current) {
        clearTimeout(terminalTimeoutRef.current);
        terminalTimeoutRef.current = null;
      }
      return;
    }

    let isMounted = true;

    const tradingMessages = [
      '[INFO] Strategy initialized: Moving Average Crossover',
      '[DATA] Fetching market data for NIFTY50...',
      '[SIGNAL] BUY signal detected at 18,450.25',
      '[EXEC] Order placed: BUY 10 NIFTY50 @ 18,450.25',
      '[FILL] Order filled: 10 NIFTY50 @ 18,450.25',
      '[PNL] Position PnL: +₹1,250.00 (+0.68%)',
      '[SIGNAL] SELL signal detected at 18,520.75',
      '[EXEC] Order placed: SELL 10 NIFTY50 @ 18,520.75',
      '[FILL] Order filled: 10 NIFTY50 @ 18,520.75',
      '[PNL] Trade closed: +₹705.00 (+0.38%)',
      '[RISK] Portfolio exposure: 45.2%',
      '[METRICS] Sharpe Ratio: 1.85 | Max DD: -2.3%',
    ];

    let lineIndex = 0;

    const addLine = () => {
      if (!isMounted) {
        if (terminalIntervalRef.current) {
          clearInterval(terminalIntervalRef.current);
          terminalIntervalRef.current = null;
        }
        return;
      }
      
      if (lineIndex < tradingMessages.length) {
        setTerminalLines(prev => {
          const newLines = [...prev, tradingMessages[lineIndex]];
          // Keep only last 8 lines visible
          return newLines.slice(-8);
        });
        lineIndex++;
      } else {
        // Reset and loop
        lineIndex = 0;
        setTerminalLines([]);
      }
    };

    // Initial delay, then add lines periodically
    terminalTimeoutRef.current = setTimeout(() => {
      if (isMounted) {
        addLine();
        terminalIntervalRef.current = setInterval(addLine, 2500);
      }
    }, 1000);

    return () => {
      isMounted = false;
      if (terminalTimeoutRef.current) {
        clearTimeout(terminalTimeoutRef.current);
        terminalTimeoutRef.current = null;
      }
      if (terminalIntervalRef.current) {
        clearInterval(terminalIntervalRef.current);
        terminalIntervalRef.current = null;
      }
    };
  }, [shouldAnimate]);

  // Window switching animation - cycles through dashboard, videos, courses
  useEffect(() => {
    if (!shouldAnimate || !hasEntered) {
      // Clear interval and timeout when animation should stop
      if (windowSwitchIntervalRef.current) {
        clearInterval(windowSwitchIntervalRef.current);
        windowSwitchIntervalRef.current = null;
      }
      if (initialTimeoutRef.current) {
        clearTimeout(initialTimeoutRef.current);
        initialTimeoutRef.current = null;
      }
      return;
    }

    let isMounted = true;

    // Initial delay to show dashboard for 5 seconds first
    initialTimeoutRef.current = setTimeout(() => {
      if (!isMounted) return;

      setIsTransitioning(true);
      
      // Switch to videos after transition starts
      setTimeout(() => {
        if (isMounted) {
          setActiveWindow('videos');
          setTimeout(() => {
            if (isMounted) {
              setIsTransitioning(false);
            }
          }, 300); // Transition duration
        }
      }, 50);

      // Then set up interval to switch every 5 seconds (5s dashboard + 5s videos + 5s courses + 5s backtesting)
      windowSwitchIntervalRef.current = setInterval(() => {
        if (!isMounted) {
          if (windowSwitchIntervalRef.current) {
            clearInterval(windowSwitchIntervalRef.current);
            windowSwitchIntervalRef.current = null;
          }
          return;
        }

        setIsTransitioning(true);
        
        // Switch window after a brief delay for transition start
        setTimeout(() => {
          if (isMounted) {
            setActiveWindow(prev => {
              if (prev === 'dashboard') return 'videos';
              if (prev === 'videos') return 'courses';
              if (prev === 'courses') return 'backtesting';
              return 'dashboard';
            });
            setTimeout(() => {
              if (isMounted) {
                setIsTransitioning(false);
              }
            }, 300); // Transition duration
          }
        }, 50);
      }, 5000); // Switch every 5 seconds
    }, 5000); // Show dashboard for 5 seconds first

    return () => {
      isMounted = false;
      if (windowSwitchIntervalRef.current) {
        clearInterval(windowSwitchIntervalRef.current);
        windowSwitchIntervalRef.current = null;
      }
      if (initialTimeoutRef.current) {
        clearTimeout(initialTimeoutRef.current);
        initialTimeoutRef.current = null;
      }
    };
  }, [shouldAnimate, hasEntered]);


  return (
    <section ref={sectionRef} className="py-24 relative font-education-demo">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Monitor Container */}
          <div className="relative">
            {/* Gradient fade overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20"></div>
            
            {/* Monitor Frame */}
            <motion.div 
              className="relative mx-auto" 
              style={{ 
                maxWidth: '700px',
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
              initial={{ 
                opacity: 0, 
                scale: 0.8,
                rotateX: -20
              }}
              animate={hasEntered ? { 
                opacity: 1, 
                scale: 1,
                rotateX: 0
              } : { 
                opacity: 0, 
                scale: 0.8,
                rotateX: -20
              }}
              transition={{ 
                duration: 1.2, 
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              {/* Monitor Screen with Curved Effect */}
              <div className="relative" style={{ 
                maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)'
              }}>
                {/* Outer Bezel */}
                <div 
                  className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-700 shadow-2xl overflow-hidden"
                  style={{
                    borderRadius: '16px 16px 8px 8px'
                  }}
                >
                  {/* Screen Bezel */}
                  <div className="bg-black p-3" style={{ borderRadius: '12px 12px 6px 6px' }}>
                    {/* Monitor Top Bezel with Brand/Indicator */}
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-16 h-1 bg-slate-700 rounded-full"></div>
                    </div>
                    
                    {/* Educational UI Content - Clear and Sharp */}
                    <div 
                      className="bg-gradient-to-br from-slate-900 to-black overflow-hidden relative"
                      style={{ 
                        height: '400px',
                        borderRadius: '8px 8px 4px 4px',
                        boxShadow: `
                          inset 0 0 80px rgba(0, 0, 0, 0.6),
                          inset 0 0 30px rgba(0, 0, 0, 0.4),
                          inset 0 -20px 40px rgba(0, 0, 0, 0.3),
                          0 0 0 1px rgba(255, 255, 255, 0.05)
                        `,
                        background: 'radial-gradient(ellipse at center top, rgba(15, 23, 42, 0.3) 0%, transparent 50%), linear-gradient(to bottom, rgb(15, 23, 42) 0%, rgb(0, 0, 0) 100%)',
                        imageRendering: 'crisp-edges',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale'
                      }}
                    >
                      {/* Window Container with tab switching */}
                      <div className="relative h-full overflow-hidden">
                        <AnimatePresence mode="wait">
                          {activeWindow === 'dashboard' ? (
                            <motion.div
                              key="dashboard"
                              initial={{ 
                                x: -100, 
                                opacity: 0, 
                                scale: 0.95
                              }}
                              animate={{ 
                                x: 0, 
                                opacity: 1, 
                                scale: 1
                              }}
                              exit={{ 
                                x: 100, 
                                opacity: 0, 
                                scale: 0.95
                              }}
                              transition={{ 
                                duration: 0.6,
                                ease: [0.25, 0.1, 0.25, 1]
                              }}
                              className="absolute inset-0"
                              style={{
                                imageRendering: 'crisp-edges',
                                WebkitFontSmoothing: 'antialiased',
                                MozOsxFontSmoothing: 'grayscale'
                              }}
                            >
                              <EducationDashboard 
                                shouldAnimate={shouldAnimate}
                                activeLine={activeLine}
                                formulaValues={formulaValues}
                              />
                            </motion.div>
                          ) : activeWindow === 'videos' ? (
                            <motion.div
                              key="videos"
                              initial={{ 
                                x: 100, 
                                opacity: 0, 
                                scale: 0.95
                              }}
                              animate={{ 
                                x: 0, 
                                opacity: 1, 
                                scale: 1
                              }}
                              exit={{ 
                                x: -100, 
                                opacity: 0, 
                                scale: 0.95
                              }}
                              transition={{ 
                                duration: 0.6,
                                ease: [0.25, 0.1, 0.25, 1]
                              }}
                              className="absolute inset-0"
                              style={{
                                imageRendering: 'crisp-edges',
                                WebkitFontSmoothing: 'antialiased',
                                MozOsxFontSmoothing: 'grayscale'
                              }}
                            >
                              <EducationVideos />
                            </motion.div>
                          ) : activeWindow === 'courses' ? (
                            <motion.div
                              key="courses"
                              initial={{ 
                                x: 100, 
                                opacity: 0, 
                                scale: 0.95
                              }}
                              animate={{ 
                                x: 0, 
                                opacity: 1, 
                                scale: 1
                              }}
                              exit={{ 
                                x: -100, 
                                opacity: 0, 
                                scale: 0.95
                              }}
                              transition={{ 
                                duration: 0.6,
                                ease: [0.25, 0.1, 0.25, 1]
                              }}
                              className="absolute inset-0"
                              style={{
                                imageRendering: 'crisp-edges',
                                WebkitFontSmoothing: 'antialiased',
                                MozOsxFontSmoothing: 'grayscale'
                              }}
                            >
                              <EducationCourses />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="backtesting"
                              initial={{ 
                                x: 100, 
                                opacity: 0, 
                                scale: 0.95
                              }}
                              animate={{ 
                                x: 0, 
                                opacity: 1, 
                                scale: 1
                              }}
                              exit={{ 
                                x: -100, 
                                opacity: 0, 
                                scale: 0.95
                              }}
                              transition={{ 
                                duration: 0.6,
                                ease: [0.25, 0.1, 0.25, 1]
                              }}
                              className="absolute inset-0"
                              style={{
                                imageRendering: 'crisp-edges',
                                WebkitFontSmoothing: 'antialiased',
                                MozOsxFontSmoothing: 'grayscale'
                              }}
                            >
                              <EducationBacktesting />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monitor Stand */}
              <div className="flex flex-col items-center mt-2" style={{ 
                maskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)'
              }}>
                {/* Stand Neck */}
                <div className="bg-gradient-to-b from-slate-700 to-slate-800 w-24 h-8 rounded-t-lg"></div>
                {/* Stand Base */}
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 w-64 h-3 rounded-lg shadow-xl"></div>
              </div>
            </motion.div>

            {/* Gaming PC on Left */}
            <motion.div 
              ref={gamingPCRef}
              className="absolute top-1/2 left-0 hidden lg:block z-10" 
              initial={{ 
                opacity: 0, 
                x: -200,
                y: '-50%'
              }}
              animate={hasEntered ? { 
                opacity: 1, 
                x: -gamingPCOffset,
                y: '-50%'
              } : { 
                opacity: 0, 
                x: -200,
                y: '-50%'
              }}
              transition={{ 
                duration: 1.0, 
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <div className="w-64 xl:w-72 relative">
                {/* PC Case */}
                <div className="relative bg-gradient-to-b from-slate-900 to-black border-2 border-slate-700 rounded-lg shadow-2xl overflow-hidden">
                  {/* Glass Side Panel with RGB Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-purple-500/10 rounded-lg">
                    {/* RGB Strip Effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-cyan-500 to-purple-500 opacity-60 animate-pulse"></div>
                  </div>
                  
                  {/* Front Panel */}
                  <div className="relative p-4 space-y-3">
                    {/* Top - Power Button & I/O */}
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-slate-600 rounded"></div>
                        <div className="w-1 h-4 bg-slate-600 rounded"></div>
                        <div className="w-1 h-4 bg-slate-600 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Middle - RGB Fans */}
                    <div className="grid grid-cols-3 gap-2 py-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="relative">
                          <div className="w-full aspect-square rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                            {/* Fan blades with RGB glow */}
                            <div className="absolute inset-0">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-black border border-slate-600 relative z-10"></div>
                          </div>
                          {/* RGB glow effect */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 via-cyan-500/30 to-purple-500/30 blur-sm animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Bottom - Brand/Logo Area */}
                    <div className="pt-2 border-t border-slate-700">
                      <div className="text-center">
                        <div className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                          ALGORYX
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">QUANT RIG</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Side RGB Accent */}
                  <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 to-purple-500 opacity-80"></div>
                </div>
                
                {/* Base/Stand */}
                <div className="mt-2 flex justify-center">
                  <div className="w-32 h-1 bg-gradient-to-b from-slate-800 to-slate-900 rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Terminal Panel on Right */}
            <motion.div 
              ref={terminalRef}
              className="absolute top-1/2 right-0 hidden lg:block z-10" 
              initial={{ 
                opacity: 0, 
                x: 200,
                y: '-50%'
              }}
              animate={hasEntered ? { 
                opacity: 1, 
                x: terminalOffset,
                y: '-50%'
              } : { 
                opacity: 0, 
                x: 200,
                y: '-50%'
              }}
              transition={{ 
                duration: 1.0, 
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <div className="w-72 xl:w-80 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Bloomberg Terminal
                  </span>
                </div>
                
                {/* Terminal Content */}
                <div className="p-4 text-xs bg-black/30" style={{ fontFamily: "'JetBrains Mono', monospace", minHeight: '400px' }}>
                  <div className="text-gray-300 leading-relaxed space-y-1">
                    {/* Terminal prompt */}
                    <div className="text-green-400 mb-2">
                      <span className="text-cyan-400">algoryx@quant</span>
                      <span className="text-gray-500">:</span>
                      <span className="text-blue-400">~/trading</span>
                      <span className="text-gray-500">$</span>
                      <span className="ml-2 text-gray-400">python quant_trader.py</span>
                    </div>
                    
                    {/* Terminal output lines */}
                    {terminalLines.length === 0 && (
                      <div className="text-gray-500 animate-pulse">
                        <span className="inline-block w-2 h-4 bg-gray-500 mr-1"></span>
                        Starting trading engine...
                      </div>
                    )}
                    
                    {terminalLines.map((line, index) => {
                      let lineColor = 'text-gray-300';
                      if (line.includes('[INFO]')) lineColor = 'text-blue-400';
                      else if (line.includes('[DATA]')) lineColor = 'text-cyan-400';
                      else if (line.includes('[SIGNAL]')) lineColor = 'text-yellow-400';
                      else if (line.includes('[EXEC]')) lineColor = 'text-purple-400';
                      else if (line.includes('[FILL]')) lineColor = 'text-green-400';
                      else if (line.includes('[PNL]')) lineColor = 'text-green-300';
                      else if (line.includes('[RISK]')) lineColor = 'text-orange-400';
                      else if (line.includes('[METRICS]')) lineColor = 'text-blue-300';
                      
                      return (
                        <motion.div
                          key={index}
                          className={lineColor}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {line}
                        </motion.div>
                      );
                    })}
                    
                    {/* Cursor */}
                    {shouldAnimate && (
                      <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse"></span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tagline - Positioned at bottom left */}
            <motion.div 
              className="absolute bottom-8 left-12 md:left-16 lg:left-20 z-30 pointer-events-none font-tagline"
              initial={{ 
                opacity: 0, 
                x: -200 
              }}
              animate={hasEntered ? { 
                opacity: 1, 
                x: 0 
              } : { 
                opacity: 0, 
                x: -200 
              }}
              transition={{ 
                duration: 1.0, 
                delay: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <p className="text-sm md:text-base text-gray-400 mb-1 italic">Learn. Build. Trade.</p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white italic">
                Master Quantitative Finance.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}



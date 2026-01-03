import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Code2, TrendingUp, Calculator } from 'lucide-react';
import { EducationDashboard, EducationCourses, EducationBacktesting } from './EducationDashboard';

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

  // Store interval refs for proper cleanup
  const executionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const formulaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const windowSwitchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Window switching state
  const [activeWindow, setActiveWindow] = useState<'dashboard' | 'courses' | 'backtesting'>('dashboard');
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

    // Initial delay to show dashboard for 8 seconds first
    initialTimeoutRef.current = setTimeout(() => {
      if (!isMounted) return;

      setIsTransitioning(true);
      
      // Switch to courses after transition starts
      setTimeout(() => {
        if (isMounted) {
          setActiveWindow('courses');
          setTimeout(() => {
            if (isMounted) {
              setIsTransitioning(false);
            }
          }, 300); // Transition duration
        }
      }, 50);

      // Then set up interval to switch every 8 seconds (8s dashboard + 8s courses + 8s backtesting)
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
              if (prev === 'dashboard') return 'courses';
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
      }, 8000); // Switch every 8 seconds
    }, 8000); // Show dashboard for 8 seconds first

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
          {/* Simple Screen Container */}
          <div className="relative">
            {/* Gradient fade overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20"></div>
            
            {/* Simple Screen */}
            <motion.div 
              className="relative mx-auto" 
              style={{ 
                maxWidth: '900px'
              }}
              initial={{ 
                opacity: 0, 
                scale: 0.95
              }}
              animate={hasEntered ? { 
                opacity: 1, 
                scale: 1
              } : { 
                opacity: 0, 
                scale: 0.95
              }}
              transition={{ 
                duration: 1.2, 
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              {/* Simple Screen Frame */}
              <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {/* Screen Content */}
                <div 
                  className="bg-gradient-to-br from-slate-900 to-black relative"
                  style={{ 
                    height: '600px',
                    boxShadow: `
                      inset 0 0 80px rgba(0, 0, 0, 0.6),
                      inset 0 0 30px rgba(0, 0, 0, 0.4),
                      0 0 0 1px rgba(255, 255, 255, 0.05)
                    `,
                    background: 'linear-gradient(to bottom, rgb(15, 23, 42) 0%, rgb(0, 0, 0) 100%)',
                    imageRendering: 'crisp-edges',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale'
                  }}
                >
                  {/* Window Container with tab switching */}
                  <div className="relative w-full h-full overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                      {activeWindow === 'dashboard' ? (
                        <motion.div
                          key="dashboard"
                          initial={hasEntered ? { 
                            x: -100, 
                            opacity: 0, 
                            scale: 0.95
                          } : {
                            x: 0,
                            opacity: 1,
                            scale: 1
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
                          className="absolute inset-0 w-full h-full"
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
                          className="absolute inset-0 w-full h-full"
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
                          className="absolute inset-0 w-full h-full"
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



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
  
  // Window switching state
  const [activeWindow, setActiveWindow] = useState<'dashboard' | 'courses' | 'backtesting'>('dashboard');
  const screenContainerRef = useRef<HTMLDivElement>(null);
  const [viewedTabs, setViewedTabs] = useState<Set<'dashboard' | 'courses' | 'backtesting'>>(new Set(['dashboard']));
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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


  // Wheel-based tab switching with smooth snap
  useEffect(() => {
    if (!screenContainerRef.current || !hasEntered) return;

    const container = screenContainerRef.current;
    const sectionHeight = 600;
    const tabPositions = {
      dashboard: 0,
      courses: sectionHeight,
      backtesting: sectionHeight * 2
    };

    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const getCurrentTab = (): 'dashboard' | 'courses' | 'backtesting' => {
      const scrollTop = container.scrollTop;
      // Use a threshold to determine which tab we're closest to
      if (scrollTop < sectionHeight * 0.5) {
        return 'dashboard';
      } else if (scrollTop < sectionHeight * 1.5) {
        return 'courses';
      } else {
        return 'backtesting';
      }
    };

    const snapToTab = (targetTab: 'dashboard' | 'courses' | 'backtesting') => {
      if (isScrolling) return;
      
      isScrolling = true;
      const targetPosition = tabPositions[targetTab];
      
      container.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      setActiveWindow(targetTab);
      setViewedTabs(prev => new Set([...prev, targetTab]));

      // Reset scrolling flag after animation completes
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 800); // Slightly longer to ensure animation completes
    };

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const deltaY = e.deltaY;
      const threshold = 30; // Minimum scroll delta to trigger tab change

      // Only change tab if scroll is significant enough
      if (Math.abs(deltaY) < threshold) return;

      // Get current tab based on actual scroll position
      const currentTab = getCurrentTab();

      if (deltaY > 0) {
        // Scrolling down - go to next tab
        if (currentTab === 'dashboard') {
          e.preventDefault();
          snapToTab('courses');
        } else if (currentTab === 'courses') {
          e.preventDefault();
          snapToTab('backtesting');
        } else if (currentTab === 'backtesting') {
          // On last tab, allow page to scroll - don't prevent default
          return;
        }
      } else {
        // Scrolling up - go to previous tab
        e.preventDefault();
        if (currentTab === 'backtesting') {
          snapToTab('courses');
        } else if (currentTab === 'courses') {
          snapToTab('dashboard');
        }
        // If already at dashboard, do nothing (allow page scroll up)
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [hasEntered]);


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
                {/* Screen Content - Scrollable Container */}
                <div 
                  ref={screenContainerRef}
                  className="bg-gradient-to-br from-slate-900 to-black relative overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  style={{ 
                    height: '600px',
                    scrollSnapType: 'y mandatory',
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
                  {/* Window Container with tab switching - Scrollable content */}
                  <div 
                    className="relative w-full"
                    style={{ 
                      height: '1800px'
                    }}
                  >
                    {/* Dashboard Section - First 600px */}
                    <div 
                      className="w-full"
                      style={{ 
                        height: '600px',
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always',
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
                    </div>

                    {/* Courses Section - Second 600px */}
                    <div 
                      className="w-full"
                      style={{ 
                        height: '600px',
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always',
                        imageRendering: 'crisp-edges',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale'
                      }}
                    >
                      <EducationCourses />
                    </div>

                    {/* Backtesting Section - Third 600px */}
                    <div 
                      className="w-full"
                      style={{ 
                        height: '600px',
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always',
                        imageRendering: 'crisp-edges',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale'
                      }}
                    >
                      <EducationBacktesting />
                    </div>
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



import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StockAnalyser } from './StockAnalyser';

// Generate realistic candlestick data
interface Candlestick {
  open: number;
  high: number;
  low: number;
  close: number;
  isUp?: boolean;
}

const generateInitialCandles = (): Array<{ open: number; high: number; low: number; close: number }> => {
  const candles: Array<{ open: number; high: number; low: number; close: number }> = [];
  let basePrice = 100;
  const candleCount = 20;
  
  for (let i = 0; i < candleCount; i++) {
    const volatility = Math.random() * 3 - 1.5;
    const open = basePrice;
    const close = basePrice + volatility;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    
    candles.push({ open, high, low, close });
    basePrice = close;
  }
  
  return candles;
};

const normalizeCandles = (
  candles: Array<{ open: number; high: number; low: number; close: number }>
): Candlestick[] => {
  // Add padding to prevent candles from touching edges
  const allValues = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...allValues);
  const maxPrice = Math.max(...allValues);
  const range = maxPrice - minPrice;
  const padding = range * 0.1; // 10% padding on top and bottom
  
  const adjustedMin = minPrice - padding;
  const adjustedMax = maxPrice + padding;
  const adjustedRange = adjustedMax - adjustedMin || 1;
  
  return candles.map(candle => ({
    open: ((candle.open - adjustedMin) / adjustedRange) * 100,
    high: ((candle.high - adjustedMin) / adjustedRange) * 100,
    low: ((candle.low - adjustedMin) / adjustedRange) * 100,
    close: ((candle.close - adjustedMin) / adjustedRange) * 100,
    isUp: candle.close >= candle.open
  }));
};

// Code snippets with similar line counts and character counts
const CODE_SNIPPETS = [
  {
    filename: 'strategy.py',
    code: `def generate_signals(data):
    # Calculate Moving Averages
    data['SMA_50'] = data['Close'].rolling(window=50).mean()
    data['SMA_200'] = data['Close'].rolling(window=200).mean()
    
    # Generate Entry Signal
    if data['SMA_50'] > data['SMA_200']:
        return "BUY"
    return "HOLD"`
  },
  {
    filename: 'risk_model.py',
    code: `def calculate_risk(portfolio):
    # Compute Value at Risk
    returns = portfolio.pct_change()
    var_95 = returns.quantile(0.05)
    
    # Risk Metrics
    volatility = returns.std() * np.sqrt(252)
    sharpe = returns.mean() / volatility
    return {"VaR": var_95, "Sharpe": sharpe}`
  },
  {
    filename: 'backtest.py',
    code: `def run_backtest(strategy, data):
    # Initialize portfolio
    capital = 100000
    positions = []
    
    # Execute strategy
    for signal in strategy.generate(data):
        if signal == "BUY":
            positions.append(execute_trade())
    return calculate_returns(positions)`
  },
  {
    filename: 'ml_model.py',
    code: `def train_predictor(features, target):
    # Split data for training
    X_train, X_test = train_test_split(features)
    y_train, y_test = train_test_split(target)
    
    # Train model
    model = RandomForestRegressor()
    model.fit(X_train, y_train)
    return model.predict(X_test)`
  }
];

export function TradingDemo() {
  // Track if animation should run (triggered on scroll)
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const [candlestickData, setCandlestickData] = useState<Candlestick[]>(() => {
    const initialCandles = generateInitialCandles();
    return normalizeCandles(initialCandles);
  });
  
  const rawCandlesRef = useRef<Array<{ open: number; high: number; low: number; close: number }>>(
    generateInitialCandles()
  );
  const trendRef = useRef<'up' | 'down'>('up');
  
  // Animated PnL values
  const [pnlAmount, setPnlAmount] = useState(31155.39);
  const [pnlPercent, setPnlPercent] = useState(31.6);
  const [pnlTrend, setPnlTrend] = useState<'up' | 'down'>('up');
  
  // Code scanning animation (from Labs.tsx)
  const [scanPosition, setScanPosition] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [animationPhase, setAnimationPhase] = useState<'scanning' | 'backspacing' | 'typing' | 'idle'>('idle');
  const codeCardContainerRef = useRef<HTMLDivElement>(null);
  const codeContentRef = useRef<HTMLDivElement>(null);
  const codeAnimationRef = useRef<number | null>(null);
  const codeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const codeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codePhaseRef = useRef<'scanning' | 'backspacing' | 'typing' | 'idle'>('idle');
  const codeIndexRef = useRef(0);
  const hasScannedOnceRef = useRef(false);
  
  // Ref for code card to calculate 25% offset
  const codeCardRef = useRef<HTMLDivElement>(null);
  const [codeCardOffset, setCodeCardOffset] = useState(0);
  
  // Store interval refs for proper cleanup
  const candlestickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const windowSwitchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const switchTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  
  // Window switching state
  const [activeWindow, setActiveWindow] = useState<'trading' | 'analyser'>('trading');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Mirror shine animation state
  const [shineKey, setShineKey] = useState(0);
  const prevActiveWindowRef = useRef<'trading' | 'analyser'>('trading');

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
          // Trigger mirror shine animation
          setTimeout(() => {
            setShineKey(1);
          }, 500);
        } else if (!entry.isIntersecting && hasAnimated) {
          // Stop animations when component is not visible
          setShouldAnimate(false);
        } else if (entry.isIntersecting && hasAnimated) {
          // Resume animations when component becomes visible again
          setShouldAnimate(true);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '-50px 0px' // Start animation slightly before fully in view
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, hasEntered]);

  // Trigger shine effect on tab/window change
  useEffect(() => {
    if (!hasEntered || !shouldAnimate) return;
    
    // Only trigger if window actually changed (not on initial mount)
    if (prevActiveWindowRef.current !== activeWindow) {
      // Trigger shine when activeWindow changes (after transition completes)
      const timeout = setTimeout(() => {
        setShineKey(prev => prev + 1);
      }, 350); // Wait for transition to complete (300ms transition + 50ms delay)

      // Update ref for next comparison
      prevActiveWindowRef.current = activeWindow;

      return () => {
        clearTimeout(timeout);
      };
    } else {
      // Update ref on initial mount
      prevActiveWindowRef.current = activeWindow;
    }
  }, [activeWindow, hasEntered, shouldAnimate]);

  // Calculate code card offset (25% of its width)
  useEffect(() => {
    const calculateOffset = () => {
      if (codeCardRef.current) {
        const width = codeCardRef.current.offsetWidth;
        setCodeCardOffset(width * 0.25);
      }
    };
    
    // Calculate on mount and when animation triggers
    calculateOffset();
    
    // Recalculate when shouldAnimate changes (in case element wasn't measured yet)
    if (shouldAnimate) {
      // Small delay to ensure element is rendered
      const timer = setTimeout(calculateOffset, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);
  
  // Code scanning animation - Main animation cycle (pauses when off-screen)
  useEffect(() => {
    if (!hasScanned || !hasEntered || !shouldAnimate) return;

    let isMounted = true;
    codeIndexRef.current = 0;
    codePhaseRef.current = 'scanning';

    const cleanup = () => {
      if (codeAnimationRef.current) {
        cancelAnimationFrame(codeAnimationRef.current);
        codeAnimationRef.current = null;
      }
      if (codeIntervalRef.current) {
        clearInterval(codeIntervalRef.current);
        codeIntervalRef.current = null;
      }
      if (codeTimeoutRef.current) {
        clearTimeout(codeTimeoutRef.current);
        codeTimeoutRef.current = null;
      }
    };

    const startScanning = () => {
      if (!isMounted) return;
      codePhaseRef.current = 'scanning';
      setAnimationPhase('scanning');
      setIsScanning(true);
      setScanPosition(0);

      const scanDuration = 2500;
      const startTime = Date.now();

      const animateScan = () => {
        if (!isMounted || codePhaseRef.current !== 'scanning') return;
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / scanDuration, 1);
        
        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        if (codeContentRef.current) {
          setScanPosition(easeInOutCubic * codeContentRef.current.offsetHeight);
        }

        if (progress < 1) {
          codeAnimationRef.current = requestAnimationFrame(animateScan);
        } else {
          setIsScanning(false);
          hasScannedOnceRef.current = true;
          codeTimeoutRef.current = setTimeout(() => {
            if (isMounted) {
              startBackspacing();
            }
          }, 1000);
        }
      };

      codeAnimationRef.current = requestAnimationFrame(animateScan);
    };

    const startBackspacing = () => {
      if (!isMounted) return;
      codePhaseRef.current = 'backspacing';
      setAnimationPhase('backspacing');
      cleanup();
      
      const fullCode = CODE_SNIPPETS[codeIndexRef.current].code;
      let currentLength = fullCode.length;
      const backspaceSpeed = 30;

      codeIntervalRef.current = setInterval(() => {
        if (!isMounted || codePhaseRef.current !== 'backspacing') {
          cleanup();
          return;
        }
        currentLength = Math.max(0, currentLength - 1);
        setDisplayedCode(fullCode.substring(0, currentLength));

        if (currentLength === 0) {
          cleanup();
          codeTimeoutRef.current = setTimeout(() => {
            if (isMounted) {
              codeIndexRef.current = (codeIndexRef.current + 1) % CODE_SNIPPETS.length;
              setCurrentCodeIndex(codeIndexRef.current);
              startTyping();
            }
          }, 500);
        }
      }, backspaceSpeed);
    };

    const startTyping = () => {
      if (!isMounted) return;
      codePhaseRef.current = 'typing';
      setAnimationPhase('typing');
      cleanup();
      
      const fullCode = CODE_SNIPPETS[codeIndexRef.current].code;
      let currentLength = 0;
      const typeSpeed = 30;

      codeIntervalRef.current = setInterval(() => {
        if (!isMounted || codePhaseRef.current !== 'typing') {
          cleanup();
          return;
        }
        currentLength = Math.min(fullCode.length, currentLength + 1);
        setDisplayedCode(fullCode.substring(0, currentLength));

        if (currentLength === fullCode.length) {
          cleanup();
          codeTimeoutRef.current = setTimeout(() => {
            if (isMounted) {
              // After typing completes, go directly to backspacing (no more scanning)
              startBackspacing();
            }
          }, 1000);
        }
      }, typeSpeed);
    };

    // Initialize with first code
    setDisplayedCode(CODE_SNIPPETS[0].code);
    startScanning();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [hasScanned, hasEntered, shouldAnimate]);

  // Initial intersection observer for code scanning
  useEffect(() => {
    if (hasScanned || !hasEntered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasScanned) {
          setTimeout(() => {
            if (codeContentRef.current) {
              setHasScanned(true);
            }
          }, 300);

          if (codeCardContainerRef.current) {
            observer.unobserve(codeCardContainerRef.current);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (codeCardContainerRef.current) {
      observer.observe(codeCardContainerRef.current);
    }

    return () => {
      if (codeCardContainerRef.current) {
        observer.unobserve(codeCardContainerRef.current);
      }
      observer.disconnect();
    };
  }, [hasScanned, hasEntered]);
  
  useEffect(() => {
    if (!shouldAnimate) {
      // Clear intervals when animation should stop
      if (candlestickIntervalRef.current) {
        clearInterval(candlestickIntervalRef.current);
        candlestickIntervalRef.current = null;
      }
      return;
    }
    
    let isMounted = true;
    
    candlestickIntervalRef.current = setInterval(() => {
      if (!isMounted) {
        if (candlestickIntervalRef.current) {
          clearInterval(candlestickIntervalRef.current);
          candlestickIntervalRef.current = null;
        }
        return;
      }
      
      setCandlestickData(prev => {
        // Remove the first candle (oldest)
        const newRawCandles = rawCandlesRef.current.slice(1);
        
        // Get the last candle's close price
        const lastCandle = rawCandlesRef.current[rawCandlesRef.current.length - 1];
        const lastClose = lastCandle.close;
        
        // Generate new candle with realistic movement
        // Alternate trend direction occasionally
        if (Math.random() < 0.3) {
          trendRef.current = trendRef.current === 'up' ? 'down' : 'up';
        }
        
        const trend = trendRef.current;
        const volatility = Math.random() * 2 + 0.5;
        
        const open = lastClose;
        let close: number;
        
        if (trend === 'up') {
          close = open + Math.random() * volatility + 0.3;
        } else {
          close = open - Math.random() * volatility - 0.3;
        }
        
        const high = Math.max(open, close) + Math.random() * 1.5;
        const low = Math.min(open, close) - Math.random() * 1.5;
        
        // Add new candle
        newRawCandles.push({ open, high, low, close });
        rawCandlesRef.current = newRawCandles;
        
        // Normalize with padding to keep all candles visible
        return normalizeCandles(newRawCandles);
      });
      
      // Update PnL values based on trend (only if still mounted)
      if (isMounted) {
        const isUp = trendRef.current === 'up';
        setPnlTrend(isUp ? 'up' : 'down');
        
        // Animate PnL amount (last 2 digits)
        setPnlAmount(prev => {
          const change = isUp ? (Math.random() * 2 + 0.5) : -(Math.random() * 2 + 0.5);
          return Math.max(30000, Math.min(35000, prev + change));
        });
        
        // Animate PnL percentage (last digit)
        setPnlPercent(prev => {
          const change = isUp ? (Math.random() * 0.2 + 0.05) : -(Math.random() * 0.2 + 0.05);
          return Math.max(30, Math.min(35, prev + change));
        });
      }
    }, 1500); // Update every 1.5 seconds for smooth animation
    
    return () => {
      isMounted = false;
      if (candlestickIntervalRef.current) {
        clearInterval(candlestickIntervalRef.current);
        candlestickIntervalRef.current = null;
      }
    };
  }, [shouldAnimate]);

  // Window switching animation - each view stays for 5 seconds
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

    const scheduleSwitchTimer = (fn: () => void, delayMs: number) => {
      const id = setTimeout(() => {
        switchTimersRef.current = switchTimersRef.current.filter((timerId) => timerId !== id);
        fn();
      }, delayMs);
      switchTimersRef.current.push(id);
      return id;
    };

    const clearSwitchTimers = () => {
      switchTimersRef.current.forEach(clearTimeout);
      switchTimersRef.current = [];
    };

    const runWindowSwitch = () => {
      if (!isMounted) return;
      setIsTransitioning(true);
      scheduleSwitchTimer(() => {
        if (!isMounted) return;
        setActiveWindow((prev) => (prev === 'trading' ? 'analyser' : 'trading'));
        scheduleSwitchTimer(() => {
          if (isMounted) setIsTransitioning(false);
        }, 300);
      }, 50);
    };

    // Initial delay to show trading view for 5 seconds first
    initialTimeoutRef.current = setTimeout(() => {
      if (!isMounted) return;
      runWindowSwitch();
      windowSwitchIntervalRef.current = setInterval(runWindowSwitch, 5000);
    }, 5000);

    return () => {
      isMounted = false;
      clearSwitchTimers();
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
    <section ref={sectionRef} className="py-24 relative font-trading-demo">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
            {/* Laptop Container */}
            <div className="relative">
              {/* Gradient fade overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20"></div>
              
              {/* Laptop Frame */}
              <motion.div 
                className="relative mx-auto" 
                style={{ 
                  maxWidth: '900px',
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
                {/* Laptop Screen */}
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-2xl border-4 border-slate-700 shadow-2xl overflow-hidden" style={{ 
                  maskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)'
                }}>
                  {/* Mirror shine overlay for laptop screen */}
                  {shineKey > 0 && (
                    <div 
                      key={`laptop-shine-${shineKey}`}
                      className="absolute inset-0 pointer-events-none z-40 rounded-t-2xl overflow-hidden"
                    >
                      <div
                        className="absolute w-full h-full"
                        style={{
                          background: 'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(255, 255, 255, 0.25) 50%, transparent 70%, transparent 100%)',
                          transform: 'translateX(-100%) translateY(-100%) skewX(-45deg)',
                          animation: 'mirrorShine 2s ease-out',
                          animationDelay: '0.8s',
                          animationFillMode: 'forwards',
                          width: '200%',
                          height: '200%'
                        }}
                      />
                    </div>
                  )}
                  {/* Screen Bezel */}
                  <div className="bg-black rounded-t-lg p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    
                    {/* Window Container with MacBook-style switching */}
                    <div className="relative bg-gradient-to-br from-slate-900 to-black rounded-lg overflow-hidden" style={{ minHeight: '500px', maxHeight: '500px' }}>
                      <AnimatePresence mode="wait">
                        {activeWindow === 'trading' ? (
                          <motion.div
                            key="trading"
                            initial={{ 
                              x: -100, 
                              opacity: 0, 
                              scale: 0.95,
                              filter: 'blur(4px)'
                            }}
                            animate={{ 
                              x: 0, 
                              opacity: 1, 
                              scale: 1,
                              filter: 'blur(0px)'
                            }}
                            exit={{ 
                              x: 100, 
                              opacity: 0, 
                              scale: 0.95,
                              filter: 'blur(4px)'
                            }}
                            transition={{ 
                              duration: 0.6,
                              ease: [0.25, 0.1, 0.25, 1]
                            }}
                            className="absolute inset-0"
                          >
                            {/* Trading UI Content */}
                            {/* Top Bar */}
                            <div className="bg-slate-800/50 border-b border-white/10 px-6 py-4">
                              {/* Top bar content can be empty or have other elements */}
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">
                        {/* Left Column - Portfolio & Chart */}
                        <div className="lg:col-span-2 space-y-4">
                          {/* Portfolio Summary */}
                          <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <p className="text-gray-400 text-sm mb-1">Portfolio value</p>
                                <p className="text-white text-2xl font-bold">$130,067.40</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-400 text-sm mb-1">Past year returns</p>
                                <p className="text-green-400 text-xl font-bold">
                                  +$
                                  {Math.floor(pnlAmount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}.
                                  <span 
                                    key={`pnl-${Math.floor((pnlAmount % 1) * 100)}`}
                                    className="inline-block transition-colors duration-300"
                                    style={{ 
                                      color: pnlTrend === 'up' ? '#10b981' : '#ef4444',
                                      animation: 'fadeIn 0.5s ease-in-out'
                                    }}
                                  >
                                    {Math.floor((pnlAmount % 1) * 100).toString().padStart(2, '0')}
                                  </span>
                                </p>
                                <p className="text-green-400 text-sm">
                                  +
                                  {Math.floor(pnlPercent * 10) / 10}.
                                  <span 
                                    key={`percent-${Math.floor((pnlPercent * 10) % 10)}`}
                                    className="inline-block transition-colors duration-300"
                                    style={{ 
                                      color: pnlTrend === 'up' ? '#10b981' : '#ef4444',
                                      animation: 'fadeIn 0.5s ease-in-out'
                                    }}
                                  >
                                    {Math.floor((pnlPercent * 10) % 10)}
                                  </span>
                                  %
                                </p>
                              </div>
                            </div>

                            {/* Candlestick Chart */}
                            <div className="h-32 bg-slate-900/50 rounded border border-white/5 relative overflow-hidden">
                              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                                {/* Grid lines */}
                                {[20, 40, 60, 80].map((y) => (
                                  <line
                                    key={y}
                                    x1="0"
                                    y1={y}
                                    x2="300"
                                    y2={y}
                                    stroke="#374151"
                                    strokeWidth="0.5"
                                    opacity="0.3"
                                  />
                                ))}
                                
                                {/* Candlesticks */}
                                {candlestickData.map((candle, index) => {
                                  const x = (index / (candlestickData.length - 1)) * 300;
                                  const candleWidth = 8;
                                  const xPos = x - candleWidth / 2;
                                  
                                  // High-Low wick
                                  const highY = 100 - candle.high;
                                  const lowY = 100 - candle.low;
                                  const openY = 100 - candle.open;
                                  const closeY = 100 - candle.close;
                                  
                                  const bodyTop = Math.min(openY, closeY);
                                  const bodyBottom = Math.max(openY, closeY);
                                  const bodyHeight = Math.abs(closeY - openY) || 1;
                                  
                                  const isNewest = index === candlestickData.length - 1;
                                  
                                  return (
                                    <g 
                                      key={`${index}-${candlestickData.length}`}
                                      style={{
                                        transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                                        transform: isNewest ? 'scale(1.05)' : 'scale(1)',
                                        opacity: 1
                                      }}
                                    >
                                      {/* High-Low wick */}
                                      <line
                                        x1={x}
                                        y1={highY}
                                        x2={x}
                                        y2={lowY}
                                        stroke={candle.isUp ? "#10b981" : "#ef4444"}
                                        strokeWidth="1"
                                        style={{
                                          transition: 'y1 0.3s ease-out, y2 0.3s ease-out, stroke 0.3s ease-out',
                                          filter: isNewest ? 'drop-shadow(0 0 2px rgba(16, 185, 129, 0.5))' : 'none'
                                        }}
                                      />
                                      {/* Body */}
                                      <rect
                                        x={xPos}
                                        y={bodyTop}
                                        width={candleWidth}
                                        height={bodyHeight}
                                        fill={candle.isUp ? "#10b981" : "#ef4444"}
                                        stroke={candle.isUp ? "#10b981" : "#ef4444"}
                                        strokeWidth="0.5"
                                        style={{
                                          transition: 'y 0.3s ease-out, height 0.3s ease-out, fill 0.3s ease-out, stroke 0.3s ease-out',
                                          filter: isNewest ? 'drop-shadow(0 0 3px rgba(16, 185, 129, 0.6))' : 'none'
                                        }}
                                      />
                                    </g>
                                  );
                                })}
                              </svg>
                              <div className="absolute bottom-2 left-2 flex gap-3 text-xs">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                                  <span className="text-gray-400">Bullish</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-red-500 rounded-sm"></div>
                                  <span className="text-gray-400">Bearish</span>
                                </div>
                              </div>
                            </div>

                            {/* Timeframe Selectors */}
                            <div className="flex gap-2 mt-4">
                              {['1M', '3M', 'YTD', '1Y', '2Y'].map((period, idx) => (
                                <button
                                  key={period}
                                  className={`px-3 py-1 rounded text-xs ${
                                    period === '1Y'
                                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                      : 'text-gray-400 hover:text-gray-300'
                                  }`}
                                >
                                  {period}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sector Performance */}
                          <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5">
                            <h4 className="text-white text-sm font-semibold mb-3">Sector Performance</h4>
                            <div className="space-y-2">
                              {[
                                { name: 'Energy', change: 1.30, positive: true },
                                { name: 'Financial', change: 0.36, positive: true },
                                { name: 'Utilities', change: 0.29, positive: true },
                                { name: 'Healthcare', change: 0.26, positive: true },
                                { name: 'Industrials', change: -0.01, positive: false },
                                { name: 'Basic Materials', change: -0.13, positive: false },
                              ].map((sector) => (
                                <div key={sector.name} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-300">{sector.name}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full ${sector.positive ? 'bg-green-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.abs(sector.change) * 10}%` }}
                                      ></div>
                                    </div>
                                    <span className={`w-12 text-right ${sector.positive ? 'text-green-400' : 'text-red-400'}`}>
                                      {sector.positive ? '+' : ''}{sector.change}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Column - News */}
                        <div className="space-y-3">
                          {/* Morning Recap */}
                          <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white text-sm font-semibold">Morning recap</h4>
                              <span className="text-gray-500 text-xs">←</span>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed mb-2">
                              Trump's renewed tariff push is shaking markets. Q1 GDP shrank 0.3% as firms rushed imports...
                            </p>
                            <p className="text-gray-500 text-xs">Summarized at 1:13PM</p>
                          </div>

                          {/* NVDA News */}
                          <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded flex items-center justify-center overflow-hidden">
                                <img 
                                  src="https://images.financialmodelingprep.com/symbol/NVDA.png" 
                                  alt="NVDA" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <span className="text-white text-sm font-semibold">NVDA</span>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed mb-2">
                              Saudi Arabia partners with Nvidia to advance AI ambitions...
                            </p>
                            <p className="text-gray-500 text-xs">Today - Just now</p>
                          </div>

                          {/* META News */}
                          <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded flex items-center justify-center overflow-hidden">
                                <img 
                                  src="https://images.financialmodelingprep.com/symbol/META.png" 
                                  alt="META" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <span className="text-white text-sm font-semibold">META</span>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed mb-2">
                              Microsoft cuts 3% of its 228,000 staff to streamline management...
                            </p>
                            <p className="text-gray-500 text-xs">Today - 2 minutes ago</p>
                          </div>

                          {/* AAPL News - Half in darkness */}
                          <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5 relative overflow-hidden">
                            {/* Dark gradient overlay covering more than half */}
                            <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-black via-black/90 via-black/60 to-transparent pointer-events-none z-10"></div>
                            
                            <div className="relative z-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded flex items-center justify-center overflow-hidden">
                                  <img 
                                    src="https://images.financialmodelingprep.com/symbol/AAPL.png" 
                                    alt="AAPL" 
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <span className="text-white text-sm font-semibold">AAPL</span>
                              </div>
                              <p className="text-gray-400 text-xs leading-relaxed mb-2">
                                Apple announces new AI features for iPhone, driving innovation in mobile technology...
                              </p>
                              <p className="text-gray-500 text-xs opacity-30">Today - 5 minutes ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="analyser"
                      initial={{ 
                        x: 100, 
                        opacity: 0, 
                        scale: 0.95,
                        filter: 'blur(4px)'
                      }}
                      animate={{ 
                        x: 0, 
                        opacity: 1, 
                        scale: 1,
                        filter: 'blur(0px)'
                      }}
                      exit={{ 
                        x: -100, 
                        opacity: 0, 
                        scale: 0.95,
                        filter: 'blur(4px)'
                      }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      className="absolute inset-0"
                    >
                      <StockAnalyser />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
                  </div>
                </div>

                {/* Laptop Base */}
                <div className="bg-gradient-to-b from-slate-700 to-slate-800 h-4 rounded-b-2xl shadow-2xl" style={{ 
                  maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)'
                }}></div>
                <div className="bg-slate-800 h-2 w-3/4 mx-auto rounded-b-lg" style={{ 
                  maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)'
                }}></div>
              </motion.div>

              {/* Code Panel on Right with Flip Animation */}
              <motion.div 
                ref={codeCardRef}
                className="absolute top-1/2 right-0 hidden lg:block z-10 code-flip-group" 
                initial={{ 
                  opacity: 0, 
                  x: 200,
                  y: '-50%'
                }}
                animate={hasEntered ? { 
                  opacity: 1, 
                  x: codeCardOffset,
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
                <div className="w-72 xl:w-80 perspective-1000">
                  <div className="relative w-full preserve-3d transition-transform duration-700 code-flip-hover">
                    {/* Front Side - Code */}
                    <div ref={codeCardContainerRef} className="relative w-full backface-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                      {/* Mirror shine overlay for code card */}
                      {shineKey > 0 && (
                        <div 
                          key={`code-shine-${shineKey}`}
                          className="absolute inset-0 pointer-events-none z-40 rounded-xl overflow-hidden"
                        >
                          <div
                            className="absolute w-full h-full"
                            style={{
                              background: 'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(255, 255, 255, 0.25) 50%, transparent 70%, transparent 100%)',
                              transform: 'translateX(-100%) translateY(-100%) skewX(-45deg)',
                              animation: 'mirrorShine 2s ease-out',
                              animationDelay: '1.2s',
                              animationFillMode: 'forwards',
                              width: '200%',
                              height: '200%'
                            }}
                          />
                        </div>
                      )}
                      {/* Code Editor Header */}
                      <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/10">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {CODE_SNIPPETS[currentCodeIndex].filename}
                        </span>
                      </div>
                      
                      {/* Code Content with scanning effect */}
                      <div className="relative overflow-hidden">
                        {/* Initial overlay - covers code until scanning starts */}
                        {!hasScanned && (
                          <div className="absolute inset-0 bg-slate-900 pointer-events-none z-10" />
                        )}
                        
                        {/* Scanning overlay - black mask that reveals code from top to bottom */}
                        {isScanning && codeContentRef.current && animationPhase === 'scanning' && (
                          <div 
                            className="absolute inset-0 bg-slate-900 pointer-events-none z-10"
                            style={{
                              maskImage: `linear-gradient(to bottom, transparent 0%, transparent ${(scanPosition / codeContentRef.current.offsetHeight) * 100}%, black ${(scanPosition / codeContentRef.current.offsetHeight) * 100}%, black 100%)`,
                              WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, transparent ${(scanPosition / codeContentRef.current.offsetHeight) * 100}%, black ${(scanPosition / codeContentRef.current.offsetHeight) * 100}%, black 100%)`,
                            }}
                          />
                        )}
                        
                        {/* Scanning line with glow effect */}
                        {isScanning && codeContentRef.current && scanPosition < codeContentRef.current.offsetHeight && animationPhase === 'scanning' && (
                          <div
                            className="absolute left-0 right-0 pointer-events-none z-20"
                            style={{
                              top: `${scanPosition}px`,
                              transform: 'translateY(-50%)',
                            }}
                          >
                            <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                            <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-sm -mt-0.5" />
                          </div>
                        )}

                        {/* Code content */}
                        <div 
                          ref={codeContentRef}
                          className="p-4 text-xs relative z-0 min-h-[200px] overflow-hidden" 
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                            {(() => {
                              if (!displayedCode) return null;
                              
                              const lines = displayedCode.split('\n');
                              return lines.map((line, lineIdx) => {
                                const safeLine = line ?? '';
                                const parts: Array<{ text: string; className: string }> = [];
                                let currentText = '';
                                let inString = false;
                                let stringChar = '';
                                let inComment = false;
                                
                                for (let i = 0; i < safeLine.length; i++) {
                                  const char = safeLine[i];
                                  const remaining = safeLine.substring(i);
                                  
                                  // Check for comments
                                  if (!inString && char === '#') {
                                    if (currentText) {
                                      parts.push({ text: currentText, className: 'text-gray-300' });
                                      currentText = '';
                                    }
                                    parts.push({ text: remaining, className: 'text-gray-500' });
                                    break;
                                  }
                                  
                                  // Check for strings
                                  if (!inComment && (char === '"' || char === "'")) {
                                    if (currentText) {
                                      parts.push({ text: currentText, className: 'text-gray-300' });
                                      currentText = '';
                                    }
                                    if (!inString) {
                                      inString = true;
                                      stringChar = char;
                                      currentText = char;
                                    } else if (char === stringChar) {
                                      currentText += char;
                                      parts.push({ text: currentText, className: 'text-green-400' });
                                      currentText = '';
                                      inString = false;
                                    } else {
                                      currentText += char;
                                    }
                                    continue;
                                  }
                                  
                                  // Check for keywords (only when not in string)
                                  if (!inString && !inComment) {
                                    if (remaining.startsWith('def ')) {
                                      if (currentText) {
                                        parts.push({ text: currentText, className: 'text-gray-300' });
                                        currentText = '';
                                      }
                                      parts.push({ text: 'def', className: 'text-purple-400' });
                                      currentText = ' ';
                                      i += 3;
                                      continue;
                                    }
                                    if (remaining.startsWith('return ')) {
                                      if (currentText.trim()) {
                                        parts.push({ text: currentText, className: 'text-gray-300' });
                                        currentText = '';
                                      }
                                      parts.push({ text: 'return', className: 'text-purple-400' });
                                      currentText = ' ';
                                      i += 6;
                                      continue;
                                    }
                                    if (remaining.startsWith('if ')) {
                                      if (currentText.trim()) {
                                        parts.push({ text: currentText, className: 'text-gray-300' });
                                        currentText = '';
                                      }
                                      parts.push({ text: 'if', className: 'text-purple-400' });
                                      currentText = ' ';
                                      i += 2;
                                      continue;
                                    }
                                    
                                    // Check for numbers
                                    if (/\d/.test(char) && (i === 0 || !/\w/.test(safeLine[i - 1]))) {
                                      if (currentText) {
                                        parts.push({ text: currentText, className: 'text-gray-300' });
                                        currentText = '';
                                      }
                                      let num = char;
                                      i++;
                                      while (i < safeLine.length && /\d/.test(safeLine[i])) {
                                        num += safeLine[i];
                                        i++;
                                      }
                                      i--;
                                      parts.push({ text: num, className: 'text-yellow-400' });
                                      continue;
                                    }
                                  }
                                  
                                  currentText += char;
                                }
                                
                                if (currentText) {
                                  parts.push({ text: currentText, className: inString ? 'text-green-400' : 'text-gray-300' });
                                }
                                
                                return (
                                  <React.Fragment key={lineIdx}>
                                    {parts.map((part, partIdx) => (
                                      <span key={partIdx} className={part.className}>
                                        {part.text}
                                      </span>
                                    ))}
                                    {lineIdx < lines.length - 1 && '\n'}
                                  </React.Fragment>
                                );
                              });
                            })()}
                            {/* Cursor blink effect during typing/backspacing */}
                            {(animationPhase === 'typing' || animationPhase === 'backspacing') && (
                              <span className="inline-block w-2 h-4 bg-cyan-400 ml-0.5 animate-pulse" />
                            )}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Back Side - Backtesting Results */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl rotate-y-180" style={{ transform: 'rotateY(180deg)' }}>
                      {/* Header */}
                      <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/10">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          backtest_results.py
                        </span>
                      </div>
                      
                      {/* Backtesting Content */}
                      <div className="p-4 space-y-4">
                        {/* Returns Distribution */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-white mb-2">Returns Distribution</h3>
                          <div className="bg-slate-800/50 rounded p-3 h-40">
                            <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                              {/* Histogram bars */}
                              {[
                                { x: 20, h: 15, color: '#ef4444' },
                                { x: 40, h: 25, color: '#f59e0b' },
                                { x: 60, h: 45, color: '#10b981' },
                                { x: 80, h: 60, color: '#10b981' },
                                { x: 100, h: 50, color: '#10b981' },
                                { x: 120, h: 35, color: '#10b981' },
                                { x: 140, h: 20, color: '#f59e0b' },
                                { x: 160, h: 10, color: '#ef4444' },
                              ].map((bar, i) => (
                                <rect
                                  key={i}
                                  x={bar.x}
                                  y={80 - bar.h}
                                  width="15"
                                  height={bar.h}
                                  fill={bar.color}
                                  opacity="0.7"
                                />
                              ))}
                              {/* Zero line */}
                              <line
                                x1="0"
                                y1="40"
                                x2="200"
                                y2="40"
                                stroke="#6b7280"
                                strokeWidth="1"
                                strokeDasharray="2,2"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tagline - Positioned at bottom left of laptop */}
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
                <p className="text-sm md:text-base text-gray-400 mb-1 italic">AlgoRyx</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white italic">
                  Algorithms Over opinion.
                </p>
              </motion.div>
            </div>
          </div>
      </div>
    </section>
  );
}


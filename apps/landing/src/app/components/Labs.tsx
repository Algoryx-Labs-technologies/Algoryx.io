import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { FlaskConical, ArrowRight, Lock } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { motion } from 'motion/react';
import { WorldMap } from './WorldMap';

function BloombergTerminal() {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Terminal output lines
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const terminalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // IntersectionObserver to trigger animation on scroll
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setShouldAnimate(true);
          setHasAnimated(true);
        } else if (!entry.isIntersecting && hasAnimated) {
          setShouldAnimate(false);
        } else if (entry.isIntersecting && hasAnimated) {
          setShouldAnimate(true);
        }
      },
      {
        threshold: 0.3
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

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

  return (
    <div ref={containerRef} className="w-full max-w-full sm:max-w-xl md:max-w-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl overflow-hidden shadow-2xl relative">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 bg-slate-800/50 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 rounded-full bg-green-500/80"></div>
        </div>
        <span className="ml-2 text-xs sm:text-sm text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Bloomberg Terminal
        </span>
      </div>
      
      {/* Terminal Content */}
      <div className="p-4 sm:p-6 md:p-8 text-xs sm:text-sm md:text-base bg-black/30 relative overflow-hidden min-h-[200px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
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
  );
}

export function Labs() {
  return (
    <section id="labs" className="py-12 md:py-16 lg:py-24 relative font-labs">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="relative bg-gradient-to-br from-blue-600/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 overflow-hidden">
          {/* Coming Soon Ribbon */}
          <div className="absolute top-0 right-0 z-20">
            <div className="relative">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-bl-lg shadow-lg">
                Coming Soon
              </div>
              <div className="absolute top-full right-0 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-blue-600"></div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
          
          {/* World Map Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-15">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-5xl h-full max-h-[700px]">
                <WorldMap className="w-full h-full" />
              </div>
            </div>
          </div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left content */}
            <div className="space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 text-xs md:text-sm">
                <FlaskConical className="w-3 h-3 md:w-4 md:h-4" />
                <span>Algoryx Labs</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Custom AI/ML & Quant
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Research Solutions
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
              Partner with our research team to develop bespoke trading algorithms, risk models, and quantitative strategies tailored to your specific needs.
              </p>

              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3 text-gray-300 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span>Custom strategy development & optimization</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-gray-300 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                  <span>Machine learning model deployment</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-gray-300 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span>Backtesting & performance analysis</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-gray-300 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                  <span>Risk management systems</span>
                </div>
              </div>

              <Button
                size="lg"
                disabled
                className="relative bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 text-sm sm:text-base px-6 sm:px-8 h-10 sm:h-12 w-full sm:w-auto opacity-50 cursor-not-allowed"
              >
                <Lock className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Visit Algoryx Labs
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            {/* Right side - Terminal display */}
            <div className="flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
              <BloombergTerminal />
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

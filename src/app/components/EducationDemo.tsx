import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Code2, TrendingUp, Calculator } from 'lucide-react';

export function EducationDemo() {
  // Track if animation should run (triggered on scroll)
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
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

  // IntersectionObserver to trigger animation on scroll
  useEffect(() => {
    if (!sectionRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setShouldAnimate(true);
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
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
    if (!shouldAnimate) return;
    
    const executionInterval = setInterval(() => {
      setActiveLine(prev => (prev + 1) % 11);
    }, 2000);
    
    return () => {
      clearInterval(executionInterval);
    };
  }, [shouldAnimate]);

  // Animate formula values
  useEffect(() => {
    if (!shouldAnimate) return;
    
    const formulaInterval = setInterval(() => {
      setFormulaValues(prev => ({
        sharpe: Math.max(1.5, Math.min(2.2, prev.sharpe + (Math.random() * 0.1 - 0.05))),
        returns: Math.max(22, Math.min(27, prev.returns + (Math.random() * 0.3 - 0.15))),
        volatility: Math.max(12, Math.min(15, prev.volatility + (Math.random() * 0.2 - 0.1)))
      }));
    }, 3000);
    
    return () => {
      clearInterval(formulaInterval);
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
    if (!shouldAnimate) return;

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
    let intervalId: NodeJS.Timeout | null = null;

    const addLine = () => {
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
    const initialTimer = setTimeout(() => {
      addLine();
      intervalId = setInterval(addLine, 2500);
    }, 1000);

    return () => {
      clearTimeout(initialTimer);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [shouldAnimate]);

  // Fixed code snippet
  const fixedCode = {
    title: 'Portfolio Optimization',
    lines: [
      { text: 'import numpy as np', type: 'import' },
      { text: 'from scipy.optimize import minimize', type: 'import' },
      { text: '', type: 'empty' },
      { text: 'def portfolio_optimize(returns, cov_matrix):', type: 'def' },
      { text: '    n = len(returns)', type: 'code' },
      { text: '    def objective(weights):', type: 'def' },
      { text: '        portfolio_return = np.dot(weights, returns)', type: 'code' },
      { text: '        portfolio_risk = np.sqrt(', type: 'code' },
      { text: '            np.dot(weights.T, np.dot(cov_matrix, weights))', type: 'code' },
      { text: '        )', type: 'code' },
      { text: '        return -portfolio_return / portfolio_risk', type: 'code' },
    ]
  };

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
              animate={shouldAnimate ? { 
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
                {/* Outer Bezel with Curve */}
                <div 
                  className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-700 shadow-2xl overflow-hidden"
                  style={{
                    borderRadius: '16px 16px 8px 8px',
                    transform: 'perspective(1500px) rotateX(3deg)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Screen Bezel */}
                  <div className="bg-black p-3" style={{ borderRadius: '12px 12px 6px 6px' }}>
                    {/* Monitor Top Bezel with Brand/Indicator */}
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-16 h-1 bg-slate-700 rounded-full"></div>
                    </div>
                    
                    {/* Educational UI Content with Curved Screen Effect */}
                    <div 
                      className="bg-gradient-to-br from-slate-900 to-black overflow-hidden relative"
                      style={{ 
                        height: '400px',
                        borderRadius: '8px 8px 4px 4px',
                        transform: 'perspective(1200px) rotateX(-2deg) scale(0.98)',
                        transformOrigin: 'center center',
                        boxShadow: `
                          inset 0 0 80px rgba(0, 0, 0, 0.6),
                          inset 0 0 30px rgba(0, 0, 0, 0.4),
                          inset 0 -20px 40px rgba(0, 0, 0, 0.3),
                          0 0 0 1px rgba(255, 255, 255, 0.05)
                        `,
                        background: 'radial-gradient(ellipse at center top, rgba(15, 23, 42, 0.3) 0%, transparent 50%), linear-gradient(to bottom, rgb(15, 23, 42) 0%, rgb(0, 0, 0) 100%)'
                      }}
                    >
                    {/* Top Bar - Code Editor Header */}
                    <div className="bg-slate-800/50 border-b border-white/10 px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          portfolio_optimize.py
                        </span>
                      </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-full overflow-hidden">
                      {/* Left Column - Code Editor */}
                      <div className="lg:col-span-2 flex flex-col">
                        {/* Code Editor */}
                        <div className="bg-slate-800/30 rounded-lg border border-white/5 overflow-hidden flex-1 flex flex-col">
                          <div className="p-3 text-xs flex-1 overflow-auto" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            <div className="text-gray-300 leading-relaxed">
                              {fixedCode.lines.map((line, index) => {
                                const isActive = shouldAnimate && activeLine === index;
                                let textColor = 'text-gray-300';
                                
                                if (line.type === 'import') textColor = 'text-cyan-400';
                                else if (line.type === 'def') textColor = 'text-purple-400';
                                else if (line.type === 'return') textColor = 'text-yellow-400';
                                else if (line.type === 'code') textColor = 'text-gray-300';
                                
                                return (
                                  <div 
                                    key={index}
                                    className={`relative ${isActive ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}
                                  >
                                    <span className={textColor}>
                                      {line.text || ' '}
                                    </span>
                                    {isActive && (
                                      <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400 animate-pulse"></span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Formula Card */}
                        <div className="bg-slate-800/30 rounded-lg p-3 border border-white/5 mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Calculator className="w-3 h-3 text-blue-400" />
                            <h4 className="text-white text-xs font-semibold">Risk Metrics</h4>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-[10px]">Sharpe Ratio:</span>
                              <span className="text-green-400 font-mono text-[10px]">
                                {formulaValues.sharpe.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-[10px]">Annual Returns:</span>
                              <span className="text-green-400 font-mono text-[10px]">
                                {formulaValues.returns.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-[10px]">Volatility:</span>
                              <span className="text-yellow-400 font-mono text-[10px]">
                                {formulaValues.volatility.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Learning Resources */}
                      <div className="space-y-2 flex flex-col">
                        {/* Progress */}
                        <div className="bg-slate-800/30 rounded-lg p-3 border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white text-xs font-semibold">Progress</h4>
                            <span className="text-gray-500 text-[10px]">65%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                              initial={{ width: '0%' }}
                              animate={shouldAnimate ? { width: '65%' } : { width: '0%' }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>

                        {/* Learning Resources */}
                        <div className="bg-slate-800/30 rounded-lg p-3 border border-white/5 flex-1">
                          <h4 className="text-white text-xs font-semibold mb-2">Resources</h4>
                          <div className="space-y-1.5">
                            {[
                              { icon: BookOpen, title: 'Portfolio Theory', status: 'completed' },
                              { icon: TrendingUp, title: 'Risk Management', status: 'active' },
                              { icon: Code2, title: 'Python Basics', status: 'upcoming' },
                            ].map((resource, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                                <resource.icon className={`w-3 h-3 ${
                                  resource.status === 'completed' ? 'text-green-400' :
                                  resource.status === 'active' ? 'text-blue-400' :
                                  'text-gray-500'
                                }`} />
                                <span className={`${
                                  resource.status === 'completed' ? 'text-gray-300' :
                                  resource.status === 'active' ? 'text-blue-300' :
                                  'text-gray-500'
                                }`}>
                                  {resource.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Formula Reference */}
                        <div className="bg-slate-800/30 rounded-lg p-3 border border-white/5">
                          <h4 className="text-white text-xs font-semibold mb-1.5">Key Formula</h4>
                          <div className="bg-slate-900/50 rounded p-2 text-[10px] font-mono text-gray-300">
                            <div className="text-cyan-400 mb-0.5">Sharpe Ratio =</div>
                            <div className="pl-3 text-[9px]">
                              (Rₚ - Rf) / σₚ
                            </div>
                            <div className="text-gray-500 text-[8px] mt-1.5">
                              Rₚ = Portfolio Return<br/>
                              Rf = Risk-free Rate<br/>
                              σₚ = Portfolio Volatility
                            </div>
                          </div>
                        </div>
                      </div>
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
              animate={shouldAnimate ? { 
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
              animate={shouldAnimate ? { 
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
                    quant_trader.py
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
              animate={shouldAnimate ? { 
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


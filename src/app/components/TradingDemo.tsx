import React, { useState, useEffect, useRef } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { TrendingUp, TrendingDown } from 'lucide-react';

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

export function TradingDemo() {
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
  
  // Code execution animation
  const [activeLine, setActiveLine] = useState(0);
  
  useEffect(() => {
    // Line-by-line execution animation
    const executionInterval = setInterval(() => {
      setActiveLine(prev => (prev + 1) % 11); // 11 lines of code (0-10)
    }, 2000);
    
    return () => {
      clearInterval(executionInterval);
    };
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
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
        
        // Update PnL values based on trend
        const isUp = trend === 'up';
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
        
        // Normalize with padding to keep all candles visible
        return normalizeCandles(newRawCandles);
      });
    }, 1500); // Update every 1.5 seconds for smooth animation
    
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="py-24 relative font-trading-demo">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto">
            {/* Laptop Container */}
            <div className="relative">
              {/* Gradient fade overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20"></div>
              
              {/* Laptop Frame */}
              <div className="relative mx-auto" style={{ maxWidth: '900px' }}>
                {/* Laptop Screen */}
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-2xl border-4 border-slate-700 shadow-2xl overflow-hidden" style={{ 
                  maskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)'
                }}>
                  {/* Screen Bezel */}
                  <div className="bg-black rounded-t-lg p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    
                    {/* Trading UI Content */}
                    <div className="bg-gradient-to-br from-slate-900 to-black rounded-lg overflow-hidden" style={{ minHeight: '500px' }}>
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
              </div>

              {/* Code Panel on Right with Flip Animation */}
              <div className="absolute top-1/2 -translate-y-1/2 right-0 hidden lg:block z-10 code-flip-group" style={{ transform: 'translateY(-50%) translateX(25%)' }}>
                <div className="w-72 xl:w-80 perspective-1000">
                  <div className="relative w-full preserve-3d transition-transform duration-700 code-flip-hover">
                    {/* Front Side - Code */}
                    <div className="relative w-full backface-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                      {/* Code Editor Header */}
                      <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/10">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          strategy.py
                        </span>
                      </div>
                      
                      {/* Code Content */}
                      <div className="p-4 text-xs relative" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <div className="text-gray-300 leading-relaxed relative">
                          {/* Line 0 - def */}
                          <div className={`relative ${activeLine === 0 ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}>
                            <span className="text-purple-400">def</span> <span className="text-cyan-400">generate_signals</span>(<span className="text-gray-300">data</span>):
                            {activeLine === 0 && <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400"></span>}
                          </div>
                          {/* Line 1 - comment */}
                          <div className={`relative ${activeLine === 1 ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}>
                            {'    '}<span className="text-gray-500"># Calculate Moving Averages</span>
                            {activeLine === 1 && <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400"></span>}
                          </div>
                          {/* Line 2 - SMA_50 */}
                          <div className={`relative ${activeLine === 2 ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}>
                            {'    '}data[<span className="text-green-400">'SMA_50'</span>] = data[<span className="text-green-400">'Close'</span>].rolling(
                            {activeLine === 2 && <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400"></span>}
                          </div>
                          {/* Line 3 - window 50 */}
                          <div className={`relative ${activeLine === 3 ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}>
                            {'        '}window=<span className="text-yellow-400">50</span>).mean()
                            {activeLine === 3 && <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400"></span>}
                          </div>
                          {/* Line 4 - SMA_200 */}
                          <div className={`relative ${activeLine === 4 ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}>
                            {'    '}data[<span className="text-green-400">'SMA_200'</span>] = data[<span className="text-green-400">'Close'</span>].rolling(
                            {activeLine === 4 && <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400"></span>}
                          </div>
                          {/* Line 5 - window 200 */}
                          <div className={`relative ${activeLine === 5 ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}>
                            {'        '}window=<span className="text-yellow-400">200</span>).mean()
                            {activeLine === 5 && <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400"></span>}
                          </div>
                          {/* Line 6 - empty */}
                          <div className={`relative ${activeLine === 6 ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}>
                            {'    '}
                            {activeLine === 6 && <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400"></span>}
                          </div>
                          {/* Line 7 - comment */}
                          <div className={`relative ${activeLine === 7 ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}>
                            {'    '}<span className="text-gray-500"># Generate Entry Signal</span>
                            {activeLine === 7 && <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400"></span>}
                          </div>
                          {/* Line 8 - if statement */}
                          <div className={`relative ${activeLine === 8 ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}>
                            {'    '}<span className="text-purple-400">if</span> data[<span className="text-green-400">'SMA_50'</span>] &gt; data[<span className="text-green-400">'SMA_200'</span>]:
                            {activeLine === 8 && <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400"></span>}
                          </div>
                          {/* Line 9 - return BUY */}
                          <div className={`relative ${activeLine === 9 ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}>
                            {'        '}<span className="text-purple-400">return</span> <span className="text-green-400">"BUY"</span>
                            {activeLine === 9 && <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400"></span>}
                          </div>
                          {/* Line 10 - return HOLD */}
                          <div className={`relative ${activeLine === 10 ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}>
                            {'    '}<span className="text-purple-400">return</span> <span className="text-green-400">"HOLD"</span>
                            {activeLine === 10 && <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400"></span>}
                          </div>
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
              </div>

              {/* Tagline - Positioned at bottom left of laptop */}
              <div className="absolute bottom-8 left-12 md:left-16 lg:left-20 z-30 pointer-events-none font-tagline">
                <p className="text-sm md:text-base text-gray-400 mb-1 italic">AlgoRyx</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white italic">
                  Algorithms Over opinion.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}


import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';

interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface ChartData {
  quarter: string;
  closing: number;
  opening: number;
  volume: number;
}

export function StockAnalyser() {
  const [topStocks, setTopStocks] = useState<StockPrice[]>([
    { symbol: 'FB', price: 176.46, change: -1.52, changePercent: -0.82 },
    { symbol: 'AAPL', price: 169.23, change: -1.85, changePercent: -1.08 },
    { symbol: 'MSFT', price: 378.92, change: 4.12, changePercent: 1.10 },
    { symbol: 'GOOGL', price: 142.56, change: -1.23, changePercent: -0.85 },
    { symbol: 'AMZN', price: 145.23, change: 2.34, changePercent: 1.64 },
    { symbol: 'TSLA', price: 248.50, change: -3.20, changePercent: -1.27 },
    { symbol: 'NVDA', price: 485.23, change: -5.67, changePercent: -1.15 },
    { symbol: 'META', price: 312.45, change: 1.23, changePercent: 0.39 },
    { symbol: 'NFLX', price: 425.67, change: 3.45, changePercent: 0.82 },
    { symbol: 'AMD', price: 128.34, change: -2.10, changePercent: -1.61 },
  ]);

  // Quarterly data for charts (Q1 2014 to Q4 2017)
  const quarters = ['Q1 2014', 'Q2 2014', 'Q3 2014', 'Q4 2014', 'Q1 2015', 'Q2 2015', 'Q3 2015', 'Q4 2015', 
                    'Q1 2016', 'Q2 2016', 'Q3 2016', 'Q4 2016', 'Q1 2017', 'Q2 2017', 'Q3 2017', 'Q4 2017'];
  
  // Initialize graph data with base values
  const [closingOpeningData, setClosingOpeningData] = useState<ChartData[]>(() => {
    return quarters.map((quarter, i) => {
      const baseValue = 0.02 + Math.sin(i * 0.4) * 0.03;
      return {
        quarter,
        closing: baseValue,
        opening: baseValue - 0.005,
        volume: 50 + Math.sin(i * 0.3) * 30
      };
    });
  });

  const [volumeData, setVolumeData] = useState(() => {
    return quarters.map((quarter, i) => ({
      quarter,
      volume: 80 + Math.sin(i * 0.25) * 50
    }));
  });

  // Animate graph data every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setClosingOpeningData(prev => prev.map((data, i) => {
        const baseValue = 0.02 + Math.sin(i * 0.4) * 0.03;
        const randomOffset = (Math.random() - 0.5) * 0.01;
        const volumeVariation = Math.random() * 20;
        
        return {
          ...data,
          closing: baseValue + randomOffset,
          opening: baseValue + randomOffset - 0.005,
          volume: 50 + Math.sin(i * 0.3) * 30 + volumeVariation
        };
      }));

      setVolumeData(prev => prev.map((data, i) => ({
        ...data,
        volume: 80 + Math.sin(i * 0.25) * 50 + Math.random() * 30
      })));
    }, 1000); // Update every 1 second

    return () => clearInterval(interval);
  }, []);

  // Animate stock prices
  useEffect(() => {
    const interval = setInterval(() => {
      setTopStocks(prev => prev.map(stock => {
        const volatility = Math.random() * 0.5 - 0.25;
        const newPrice = stock.price + volatility;
        const change = newPrice - stock.price;
        const changePercent = (change / stock.price) * 100;
        
        return {
          ...stock,
          price: newPrice,
          change: change,
          changePercent: changePercent
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-black h-full flex flex-col overflow-hidden">
      {/* Top Control Bar */}
      <div className="bg-slate-800/50 border-b border-white/10 px-4 py-2 flex items-center gap-3 flex-wrap">
        <select className="bg-slate-700/50 text-white text-xs px-2 py-1 rounded border border-white/10">
          <option>All</option>
          <option>AAPL</option>
          <option>MSFT</option>
          <option>GOOGL</option>
        </select>
        <select className="bg-slate-700/50 text-white text-xs px-2 py-1 rounded border border-white/10">
          <option>All</option>
          <option>2014</option>
          <option>2015</option>
          <option>2016</option>
          <option>2017</option>
        </select>
        <select className="bg-slate-700/50 text-white text-xs px-2 py-1 rounded border border-white/10">
          <option>All</option>
          <option>January</option>
          <option>February</option>
          <option>March</option>
        </select>
        <select className="bg-slate-700/50 text-white text-xs px-2 py-1 rounded border border-white/10">
          <option>All</option>
          <option>Q1</option>
          <option>Q2</option>
          <option>Q3</option>
          <option>Q4</option>
        </select>
        <div className="flex items-center gap-2 text-xs text-gray-300 ml-auto">
          <Calendar className="w-3 h-3" />
          <span>1/2/2014 - 12/29/2017</span>
        </div>
      </div>

      {/* Main Content - Grid Layout */}
      <div className="flex-1 grid grid-cols-12 gap-3 p-3 overflow-hidden">
        {/* Left Panel - Key Metrics */}
        <div className="col-span-2 bg-slate-800/30 rounded-lg p-3 border border-white/5 flex flex-col justify-start space-y-4">
          <h4 className="text-white text-xs font-semibold mb-2">Key Metrics</h4>
          <div>
            <p className="text-gray-400 text-xs mb-1">Highest Volume Traded</p>
            <p className="text-white text-sm font-bold">618.2M</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Lowest Volume Traded</p>
            <p className="text-white text-sm font-bold">0</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">All time Low Price</p>
            <p className="text-white text-sm font-bold">1.5</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">All time High Price</p>
            <p className="text-white text-sm font-bold">2,068.0</p>
          </div>
        </div>

        {/* Middle Panel - Charts */}
        <div className="col-span-7 flex flex-col gap-3 overflow-hidden">
          {/* Top Stock Tickers */}
          <div className="bg-slate-800/30 rounded-lg p-2 border border-white/5">
            <h4 className="text-white text-xs font-semibold mb-2">Today's Top 10 Stock Prices</h4>
            <div className="flex flex-wrap gap-2">
              {topStocks.slice(0, 10).map((stock) => (
                <div key={stock.symbol} className="flex items-center gap-1 text-xs">
                  <span className="text-white font-medium">{stock.symbol}</span>
                  <span className="text-white">{stock.price.toFixed(2)}</span>
                  <span className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Closing VS Opening Chart */}
          <div className="bg-slate-800/30 rounded-lg p-3 border border-white/5 flex-1 min-h-0">
            <h4 className="text-white text-xs font-semibold mb-2">Closing VS Opening</h4>
            <div className="h-full relative">
              <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                {/* Grid lines */}
                {[20, 40, 60, 80, 100].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="800"
                    y2={y}
                    stroke="#374151"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                ))}
                
                {/* Volume bars */}
                {closingOpeningData.map((data, i) => {
                  const x = (i / (closingOpeningData.length - 1)) * 800;
                  const barWidth = 800 / closingOpeningData.length * 0.8;
                  const barHeight = (data.volume / 200) * 100;
                  const isPositive = data.closing >= data.opening;
                  
                  return (
                    <rect
                      key={i}
                      x={x - barWidth / 2}
                      y={120 - barHeight}
                      width={barWidth}
                      height={barHeight}
                      fill={isPositive ? "#10b981" : "#ef4444"}
                      opacity="0.6"
                      style={{
                        transition: 'y 0.8s ease-out, height 0.8s ease-out, fill 0.8s ease-out'
                      }}
                    />
                  );
                })}
                
                {/* Closing line */}
                <polyline
                  key={`closing-${closingOpeningData.map(d => d.closing).join(',')}`}
                  points={closingOpeningData.map((data, i) => {
                    const x = (i / (closingOpeningData.length - 1)) * 800;
                    const y = 120 - (data.closing * 2000);
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  style={{
                    transition: 'all 0.8s ease-out'
                  }}
                />
                
                {/* Opening line */}
                <polyline
                  key={`opening-${closingOpeningData.map(d => d.opening).join(',')}`}
                  points={closingOpeningData.map((data, i) => {
                    const x = (i / (closingOpeningData.length - 1)) * 800;
                    const y = 120 - (data.opening * 2000);
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                  opacity="0.7"
                  style={{
                    transition: 'all 0.8s ease-out'
                  }}
                />
              </svg>
              <div className="absolute bottom-1 left-1 flex gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded"></div>
                  <span className="text-gray-400">Closing VS Opening</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded"></div>
                  <span className="text-gray-400">Total Volume</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Volume Chart */}
          <div className="bg-slate-800/30 rounded-lg p-3 border border-white/5 flex-1 min-h-0">
            <h4 className="text-white text-xs font-semibold mb-2">Total Volume</h4>
            <div className="h-full relative">
              <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                {/* Grid lines */}
                {[20, 40, 60, 80, 100].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="800"
                    y2={y}
                    stroke="#374151"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                ))}
                
                {/* Volume bars */}
                {volumeData.map((data, i) => {
                  const x = (i / (volumeData.length - 1)) * 800;
                  const barWidth = 800 / volumeData.length * 0.8;
                  const barHeight = (data.volume / 200) * 100;
                  
                  return (
                    <rect
                      key={i}
                      x={x - barWidth / 2}
                      y={120 - barHeight}
                      width={barWidth}
                      height={barHeight}
                      fill="#3b82f6"
                      opacity="0.7"
                      style={{
                        transition: 'y 0.8s ease-out, height 0.8s ease-out'
                      }}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Panel - Stocks Summary */}
        <div className="col-span-3 bg-slate-800/30 rounded-lg p-3 border border-white/5 overflow-hidden flex flex-col">
          <h4 className="text-white text-xs font-semibold mb-2">Stocks Summary</h4>
          <div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 py-1 pr-2">Description</th>
                  <th className="text-right text-gray-400 py-1 px-1">Last 7 Days</th>
                  <th className="text-right text-gray-400 py-1 px-1">Last 30 Days</th>
                  <th className="text-right text-gray-400 py-1 pl-1">Selected Days</th>
                </tr>
              </thead>
              <tbody className="text-white">
                <tr className="border-b border-white/5">
                  <td className="py-1.5 pr-2">Volume</td>
                  <td className="text-right px-1">2.40M</td>
                  <td className="text-right px-1">3.86M</td>
                  <td className="text-right pl-1">4.25M</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1.5 pr-2">High Price</td>
                  <td className="text-right px-1">1.78K</td>
                  <td className="text-right px-1">1.79K</td>
                  <td className="text-right pl-1">2.07K</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-1.5 pr-2">Low Price</td>
                  <td className="text-right px-1">3.88</td>
                  <td className="text-right px-1">3.50</td>
                  <td className="text-right pl-1">1.50</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-2">Closing Price</td>
                  <td className="text-right px-1">107.17</td>
                  <td className="text-right px-1">106.52</td>
                  <td className="text-right pl-1">86.37</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

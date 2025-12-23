import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function TradingDemo() {
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
                                <p className="text-green-400 text-xl font-bold">+$31,155.39</p>
                                <p className="text-green-400 text-sm">+31.6%</p>
                              </div>
                            </div>

                            {/* Mini Chart */}
                            <div className="h-32 bg-slate-900/50 rounded border border-white/5 relative overflow-hidden">
                              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                                {/* Portfolio Line */}
                                <path
                                  d="M 0,80 Q 50,60 100,50 T 200,40 T 300,35"
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="2"
                                />
                                {/* S&P 500 Line */}
                                <path
                                  d="M 0,85 Q 50,70 100,65 T 200,60 T 300,55"
                                  fill="none"
                                  stroke="#6b7280"
                                  strokeWidth="1.5"
                                  strokeDasharray="4,4"
                                />
                              </svg>
                              <div className="absolute bottom-2 left-2 flex gap-3 text-xs">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-0.5 bg-green-400"></div>
                                  <span className="text-gray-400">Portfolio</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-0.5 bg-gray-500 border-dashed"></div>
                                  <span className="text-gray-400">S&P 500</span>
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
                              <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center">
                                <span className="text-green-400 text-xs font-bold">NV</span>
                              </div>
                              <span className="text-white text-sm font-semibold">NVDA</span>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed mb-2">
                              Saudi Arabia partners with Nvidia to advance AI ambitions...
                            </p>
                            <p className="text-gray-500 text-xs">Today - Just now</p>
                          </div>

                          {/* MSFT News */}
                          <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                                <span className="text-blue-400 text-xs font-bold">MS</span>
                              </div>
                              <span className="text-white text-sm font-semibold">MSFT</span>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed mb-2">
                              Microsoft cuts 3% of its 228,000 staff to streamline management...
                            </p>
                            <p className="text-gray-500 text-xs">Today - 2 minutes ago</p>
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

              {/* Code Panel on Right */}
              <div className="absolute top-1/2 -translate-y-1/2 right-0 hidden lg:block z-10" style={{ transform: 'translateY(-50%) translateX(25%)' }}>
                <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl w-72 xl:w-80">
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
                  <div className="p-4 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <pre className="text-gray-300 leading-relaxed">
                      <span className="text-purple-400">def</span> <span className="text-cyan-400">generate_signals</span>(<span className="text-gray-300">data</span>):{'\n'}
                      {'    '}<span className="text-gray-500"># Calculate Moving Averages</span>{'\n'}
                      {'    '}data[<span className="text-green-400">'SMA_50'</span>] = data[<span className="text-green-400">'Close'</span>].rolling({'\n'}
                      {'        '}window=<span className="text-yellow-400">50</span>).mean(){'\n'}
                      {'    '}data[<span className="text-green-400">'SMA_200'</span>] = data[<span className="text-green-400">'Close'</span>].rolling({'\n'}
                      {'        '}window=<span className="text-yellow-400">200</span>).mean(){'\n'}
                      {'    '}{'\n'}
                      {'    '}<span className="text-gray-500"># Generate Entry Signal</span>{'\n'}
                      {'    '}<span className="text-purple-400">if</span> data[<span className="text-green-400">'SMA_50'</span>] &gt; data[<span className="text-green-400">'SMA_200'</span>]:{'\n'}
                      {'        '}<span className="text-purple-400">return</span> <span className="text-green-400">"BUY"</span>{'\n'}
                      {'    '}<span className="text-purple-400">return</span> <span className="text-green-400">"HOLD"</span>
                    </pre>
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


import React from 'react';
import { Button } from './ui/button';
import { FlaskConical, ArrowRight, Lock } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export function Labs() {
  return (
    <section id="labs" className="py-12 md:py-16 lg:py-24 relative">
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
                Professional research and development services for traders, fund managers, and financial institutions.
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

            {/* Right side - Code display */}
            <div className="flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl overflow-hidden shadow-2xl">
                {/* Code editor header */}
                <div className="flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 bg-slate-800/50 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="ml-2 text-xs sm:text-sm text-gray-400 font-mono">strategy.py</span>
                </div>
                
                {/* Code content */}
                <div className="p-4 sm:p-6 md:p-8 font-mono text-xs sm:text-sm md:text-base overflow-x-auto">
                  <pre className="text-gray-300 leading-relaxed whitespace-pre">
                    <span className="text-purple-400">def</span> <span className="text-cyan-400">generate_signals</span><span className="text-white">(</span><span className="text-orange-400">data</span><span className="text-white">):</span>{'\n'}
                    {'    '}<span className="text-gray-500"># Calculate Moving Averages</span>{'\n'}
                    {'    '}<span className="text-orange-400">data</span><span className="text-white">[</span><span className="text-green-400">'SMA_50'</span><span className="text-white">]</span> <span className="text-white">=</span> <span className="text-orange-400">data</span><span className="text-white">[</span><span className="text-green-400">'Close'</span><span className="text-white">].</span><span className="text-cyan-400">rolling</span><span className="text-white">(</span><span className="text-cyan-300">window</span><span className="text-white">=</span><span className="text-yellow-400">50</span><span className="text-white">).</span><span className="text-cyan-400">mean</span><span className="text-white">()</span>{'\n'}
                    {'    '}<span className="text-orange-400">data</span><span className="text-white">[</span><span className="text-green-400">'SMA_200'</span><span className="text-white">]</span> <span className="text-white">=</span> <span className="text-orange-400">data</span><span className="text-white">[</span><span className="text-green-400">'Close'</span><span className="text-white">].</span><span className="text-cyan-400">rolling</span><span className="text-white">(</span><span className="text-cyan-300">window</span><span className="text-white">=</span><span className="text-yellow-400">200</span><span className="text-white">).</span><span className="text-cyan-400">mean</span><span className="text-white">()</span>{'\n'}
                    {'\n'}
                    {'    '}<span className="text-gray-500"># Generate Entry Signal</span>{'\n'}
                    {'    '}<span className="text-purple-400">if</span> <span className="text-orange-400">data</span><span className="text-white">[</span><span className="text-green-400">'SMA_50'</span><span className="text-white">]</span> <span className="text-white">&gt;</span> <span className="text-orange-400">data</span><span className="text-white">[</span><span className="text-green-400">'SMA_200'</span><span className="text-white">]:</span>{'\n'}
                    {'        '}<span className="text-purple-400">return</span> <span className="text-green-400">"BUY"</span>{'\n'}
                    {'    '}<span className="text-purple-400">return</span> <span className="text-green-400">"HOLD"</span>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

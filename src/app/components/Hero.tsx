import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, LineChart, ChevronRight, Gauge, Crosshair, BarChart3, Zap, Search } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export function Hero() {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden font-hero">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <ScrollReveal>
            <div className="space-y-8">
            <div className="inline-block w-full sm:w-auto -mt-4 sm:-mt-3">
              <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 text-xs sm:text-sm md:text-base font-normal leading-relaxed break-words max-w-full">
              India's first edtech platform for algorithmic trading and quantitative research.
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Algorithms Over
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Opinion
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
              Learn systematic trading and quantitative research for Indian markets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 text-base px-8 h-12"
              >
                Join the Waitlist
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="group border-white/40 hover:border-white/60 bg-transparent hover:bg-white/10 text-white hover:text-white border-2 transition-all duration-300 text-base px-8 h-12"
              >
                Explore Courses
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-500">Early Signups</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">10+</div>
                <div className="text-sm text-gray-500">Expert Mentors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-500">India Focused</div>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Right side - Abstract visualization */}
          <ScrollReveal delay={0.2}>
            <div className="relative hidden lg:block">
            <div className="relative w-full h-[600px]">
              {/* Chart visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Glowing orb */}
                  <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-gradient-to-br from-blue-500/40 to-cyan-400/40 rounded-full blur-3xl opacity-50"></div>
                  
                  {/* Chart lines with connections */}
                  <svg className="w-full h-full" viewBox="0 0 500 500" style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
                      </linearGradient>
                      <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Main trending line */}
                    <path
                      id="mainLine"
                      d="M 60 360 Q 130 310, 200 290 Q 260 260, 320 210 Q 380 160, 440 130"
                      stroke="url(#lineGradient)"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="12,6"
                      opacity="0.9"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;-18"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </path>
                    
                    {/* Data points with glow */}
                    <circle cx="200" cy="290" r="7" fill="#3b82f6" filter="url(#glow)" opacity="0.95">
                      <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="320" cy="210" r="7" fill="#06b6d4" filter="url(#glow)" opacity="0.95">
                      <animate attributeName="r" values="6;8;6" dur="2s" begin="0.4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="440" cy="130" r="7" fill="#3b82f6" filter="url(#glow)" opacity="0.95">
                      <animate attributeName="r" values="6;8;6" dur="2s" begin="0.8s" repeatCount="indefinite" />
                    </circle>
                    
                    {/* Connection paths from metric cards to central Research hub */}
                    {/* Portfolio (top-right) to Research (center) */}
                    <path id="connToResearch1" d="M 390 90 L 250 250" fill="none" stroke="none" />
                    {/* Win Rate (top-left) to Research (center) */}
                    <path id="connToResearch2" d="M 110 110 L 250 250" fill="none" stroke="none" />
                    {/* Profit Factor (middle-right) to Research (center) */}
                    <path id="connToResearch3" d="M 410 250 L 250 250" fill="none" stroke="none" />
                    {/* Volatility (middle-left) to Research (center) */}
                    <path id="connToResearch4" d="M 110 250 L 250 250" fill="none" stroke="none" />
                    {/* Max Drawdown (bottom-right) to Research (center) */}
                    <path id="connToResearch5" d="M 390 390 L 250 250" fill="none" stroke="none" />
                    {/* Sharpe Ratio (bottom-left) to Research (center) */}
                    <path id="connToResearch6" d="M 90 430 L 250 250" fill="none" stroke="none" />
                    
                    {/* Connection lines from all metrics to Research (static) */}
                    <line x1="390" y1="90" x2="250" y2="250" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.4" />
                    <line x1="110" y1="110" x2="250" y2="250" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.4" />
                    <line x1="410" y1="250" x2="250" y2="250" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.4" />
                    <line x1="110" y1="250" x2="250" y2="250" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.4" />
                    <line x1="390" y1="390" x2="250" y2="250" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.4" />
                    <line x1="90" y1="430" x2="250" y2="250" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.4" />
                    
                    {/* Animated dots running along wires to Research hub - matching card colors */}
                    {/* Portfolio (green) */}
                    <circle r="3.5" fill="#22c55e" filter="url(#glow)" opacity="0.95">
                      <animateMotion dur="2.5s" repeatCount="indefinite">
                        <mpath href="#connToResearch1" />
                      </animateMotion>
                    </circle>
                    {/* Win Rate (blue) */}
                    <circle r="3.5" fill="#60a5fa" filter="url(#glow)" opacity="0.95">
                      <animateMotion dur="2.3s" repeatCount="indefinite" begin="0.3s">
                        <mpath href="#connToResearch2" />
                      </animateMotion>
                    </circle>
                    {/* Profit Factor (purple) */}
                    <circle r="3.5" fill="#a78bfa" filter="url(#glow)" opacity="0.95">
                      <animateMotion dur="2s" repeatCount="indefinite" begin="0.6s">
                        <mpath href="#connToResearch3" />
                      </animateMotion>
                    </circle>
                    {/* Volatility (yellow) */}
                    <circle r="3.5" fill="#facc15" filter="url(#glow)" opacity="0.95">
                      <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.4s">
                        <mpath href="#connToResearch4" />
                      </animateMotion>
                    </circle>
                    {/* Max Drawdown (orange) */}
                    <circle r="3.5" fill="#fb923c" filter="url(#glow)" opacity="0.95">
                      <animateMotion dur="2.4s" repeatCount="indefinite" begin="0.2s">
                        <mpath href="#connToResearch5" />
                      </animateMotion>
                    </circle>
                    {/* Sharpe Ratio (cyan) */}
                    <circle r="3.5" fill="#22d3ee" filter="url(#glow)" opacity="0.95">
                      <animateMotion dur="2.6s" repeatCount="indefinite" begin="0.8s">
                        <mpath href="#connToResearch6" />
                      </animateMotion>
                    </circle>
                    
                    {/* Central Research hub glow */}
                    <circle cx="250" cy="250" r="12" fill="#06b6d4" opacity="0.3" filter="url(#glow)">
                      <animate attributeName="r" values="10;15;10" dur="3s" repeatCount="indefinite" />
                    </circle>
                  </svg>

                  {/* Trading metric cards - Hierarchical layout */}
                  {/* Primary Metrics - Top Row */}
                  <div className="absolute top-12 right-12 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-green-500/40 rounded-xl p-4 shadow-2xl hover:border-green-500/60 hover:scale-105 transition-all z-10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <LineChart className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-medium text-gray-300">Portfolio</span>
                    </div>
                    <div className="text-xl font-bold text-green-400">+24.8%</div>
                  </div>

                  <div className="absolute top-12 left-12 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-blue-500/40 rounded-xl p-4 shadow-2xl hover:border-blue-500/60 hover:scale-105 transition-all z-10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Crosshair className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-medium text-gray-300">Win Rate</span>
                    </div>
                    <div className="text-xl font-bold text-blue-400">68.5%</div>
                  </div>

                  {/* Secondary Metrics - Middle Row */}
                  <div className="absolute top-1/2 right-16 transform -translate-y-1/2 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-500/35 rounded-lg p-3 shadow-xl hover:border-purple-500/55 hover:scale-105 transition-all z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-xs text-gray-400">Profit Factor</span>
                    </div>
                    <div className="text-base font-bold text-purple-400">1.87</div>
                  </div>

                  <div className="absolute top-1/2 left-16 transform -translate-y-1/2 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-yellow-500/35 rounded-lg p-3 shadow-xl hover:border-yellow-500/55 hover:scale-105 transition-all z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <Gauge className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-xs text-gray-400">Volatility</span>
                    </div>
                    <div className="text-base font-bold text-yellow-400">12.4%</div>
                  </div>

                  {/* Tertiary Metrics - Bottom Row */}
                  <div className="absolute bottom-20 right-12 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-orange-500/35 rounded-lg p-3 shadow-xl hover:border-orange-500/55 hover:scale-105 transition-all z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xs text-gray-400">Max Drawdown</span>
                    </div>
                    <div className="text-base font-bold text-orange-400">-8.2%</div>
                  </div>

                  <div className="absolute bottom-24 left-12 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-cyan-500/35 rounded-lg p-3 shadow-xl hover:border-cyan-500/55 hover:scale-105 transition-all z-10">
                    <div className="text-xs text-gray-400 mb-1">Sharpe Ratio</div>
                    <div className="text-base font-bold text-cyan-400">2.34</div>
                  </div>

                  {/* Central Research Hub - Small card in the middle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border-2 border-cyan-500/50 rounded-xl p-3 shadow-2xl hover:border-cyan-500/70 hover:scale-110 transition-all z-20">
                    <div className="flex items-center gap-2 mb-1">
                      <Search className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-semibold text-cyan-300">Research</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

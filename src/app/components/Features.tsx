import React from 'react';
import { LineChart, Cpu, Crosshair, Gauge } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

// Top row cards (3 smaller cards)
const topCards = [
  {
    icon: LineChart,
    title: 'Quant Trading Education',
    description: 'Master algorithmic trading with comprehensive courses covering strategy development, backtesting, and live deployment.',
  },
  {
    icon: Crosshair,
    title: 'India Market Focused Strategies',
    description: 'Learn trading strategies specifically designed for NSE and BSE, accounting for Indian market nuances and regulations.',
  },
  {
    icon: Cpu,
    title: 'AI & ML Research Labs',
    description: 'Access cutting-edge machine learning tools and research infrastructure for developing intelligent trading systems.',
  },
];

// Bottom row cards (2 larger cards with visuals)
const bottomCards = [
  {
    icon: Gauge,
    title: 'Real-world Projects & Backtesting',
    description: 'Build and test strategies on historical data with professional-grade backtesting infrastructure and real market scenarios.',
    hasVisual: true,
    visualType: 'chart',
  },
  {
    icon: Crosshair,
    title: 'Advanced Metrics, Simplified',
      description: 'Complex financial metrics are crunched and delivered in clean, easy-to-understand charts that give you true clarity.',
      hasVisual: true,
    visualType: 'network',
  },
];

// Chart visual component
function ChartVisual() {
  const points = [20, 35, 25, 45, 30, 50, 40, 60, 55, 70, 65, 80];
  const maxY = Math.max(...points);
  
  return (
    <div className="relative w-full h-full flex items-end justify-center p-4">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        <polyline
          points={points.map((p, i) => `${(i * 200) / (points.length - 1)},${100 - (p / maxY) * 80}`).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={(i * 200) / (points.length - 1)}
            cy={100 - (p / maxY) * 80}
            r="2"
            fill="currentColor"
            className="text-white"
          />
        ))}
      </svg>
      {/* Window frame dots */}
      <div className="absolute top-2 left-4 flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-white/30"></div>
        <div className="w-2 h-2 rounded-full bg-white/30"></div>
        <div className="w-2 h-2 rounded-full bg-white/30"></div>
      </div>
    </div>
  );
}

// Network visual component
function NetworkVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <svg viewBox="0 0 200 150" className="w-full h-full">
        {/* Connection lines */}
        <line x1="50" y1="75" x2="100" y2="50" stroke="currentColor" strokeWidth="1.5" className="text-white/40" />
        <line x1="50" y1="75" x2="100" y2="100" stroke="currentColor" strokeWidth="1.5" className="text-white/40" />
        <line x1="150" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1.5" className="text-white/40" />
        <line x1="150" y1="100" x2="100" y2="100" stroke="currentColor" strokeWidth="1.5" className="text-white/40" />
        <line x1="150" y1="50" x2="100" y2="75" stroke="currentColor" strokeWidth="1.5" className="text-white/40" />
        <line x1="150" y1="100" x2="100" y2="75" stroke="currentColor" strokeWidth="1.5" className="text-white/40" />
        
        {/* User nodes */}
        <circle cx="50" cy="75" r="12" fill="currentColor" className="text-blue-400" />
        <circle cx="100" cy="50" r="12" fill="currentColor" className="text-blue-400" />
        <circle cx="100" cy="100" r="12" fill="currentColor" className="text-blue-400" />
        <circle cx="150" cy="50" r="12" fill="currentColor" className="text-blue-400" />
        <circle cx="150" cy="100" r="12" fill="currentColor" className="text-blue-400" />
        
        {/* User icons */}
        <text x="50" y="80" textAnchor="middle" fontSize="10" fill="white" className="font-bold">R</text>
        <text x="100" y="55" textAnchor="middle" fontSize="10" fill="white" className="font-bold">A</text>
        <text x="100" y="105" textAnchor="middle" fontSize="10" fill="white" className="font-bold">V</text>
        <text x="150" y="55" textAnchor="middle" fontSize="10" fill="white" className="font-bold">S</text>
        <text x="150" y="105" textAnchor="middle" fontSize="10" fill="white" className="font-bold">G</text>
      </svg>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-24 relative font-features">
      <div className="container mx-auto px-6 max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Why Choose Algoryx
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to succeed in quantitative trading
            </p>
          </div>
        </ScrollReveal>

        {/* Top row: 3 smaller cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {topCards.map((card, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] h-full flex flex-col">
                {/* Icon */}
                <div className="mb-4 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform flex-shrink-0">
                  <card.icon className="w-6 h-6 text-blue-400" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm flex-1">
                    {card.description}
                  </p>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom row: 2 larger cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {bottomCards.map((card, index) => (
            <ScrollReveal key={index} delay={(index + 3) * 0.1}>
              <div className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] overflow-hidden h-full">
                <div className="flex gap-6 h-full">
                  {/* Left section: Content */}
                  <div className="flex-1 flex flex-col">
                    {/* Icon */}
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform flex-shrink-0">
                        <card.icon className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed text-sm flex-1">
                      {card.description}
                    </p>
                  </div>

                  {/* Right section: Visual */}
                  {card.hasVisual && (
                    <div className="flex-shrink-0 w-32 md:w-40 h-full flex items-center justify-center">
                      {card.visualType === 'chart' ? (
                        <ChartVisual />
                      ) : (
                        <NetworkVisual />
                      )}
                    </div>
                  )}
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}


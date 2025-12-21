import React from 'react';
import { LineChart, Cpu, Crosshair, Gauge } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const features = [
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
  {
    icon: Gauge,
    title: 'Real-world Projects & Backtesting',
    description: 'Build and test strategies on historical data with professional-grade backtesting infrastructure and real market scenarios.',
  },
];

export function Features() {
  return (
    <section className="py-24 relative font-features">
      <div className="container mx-auto px-6">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div
                className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              >
              {/* Icon */}
              <div className="mb-4 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-300"></div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

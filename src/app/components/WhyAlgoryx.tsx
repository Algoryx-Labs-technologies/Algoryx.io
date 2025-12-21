import React from 'react';
import { Users, Target, Rocket, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const benefits = [
  {
    icon: Users,
    title: 'Mentored by Top Engineering Talent',
    description: 'Learn from experienced quants, data scientists, and traders from leading firms and institutions.',
  },
  {
    icon: Target,
    title: 'Built for Indian Traders & Students',
    description: 'Curriculum specifically designed for NSE/BSE markets with India-specific regulations and strategies.',
  },
  {
    icon: Rocket,
    title: 'Practical, Project-Based Learning',
    description: 'Build real trading systems and strategies through hands-on projects with actual market data.',
  },
  {
    icon: ShieldCheck,
    title: 'Community & Lifetime Access',
    description: 'Join a vibrant community of quant traders with lifetime access to course materials and updates.',
  },
];

export function WhyAlgoryx() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              The Algoryx Advantage
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            What sets us apart in quantitative trading education
          </p>
        </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div
                className="flex gap-4 group"
              >
              {/* Icon container */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 group-hover:scale-110 transition-all">
                  <benefit.icon className="w-7 h-7 text-blue-400" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Stats section */}
        <ScrollReveal delay={0.3}>
          <div className="mt-20 relative">
          <div className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                  15+
                </div>
                <div className="text-gray-400">Expert Instructors</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <div className="text-gray-400">Hours of Content</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-gray-400">Hands-on Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                  ∞
                </div>
                <div className="text-gray-400">Lifetime Access</div>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

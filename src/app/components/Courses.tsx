import React from 'react';
import { GraduationCap, Code2, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollReveal } from './ScrollReveal';

const courses = [
  {
    icon: GraduationCap,
    title: 'Algorithmic Trading Foundations',
    description: 'Master the fundamentals of systematic trading, from market microstructure to order execution strategies.',
    topics: ['Market Basics', 'Order Types', 'Risk Management', 'Strategy Design'],
    duration: '8 weeks',
  },
  {
    icon: Code2,
    title: 'Python for Quant Finance',
    description: 'Learn Python programming specifically for quantitative finance, data analysis, and automated trading systems.',
    topics: ['Pandas & NumPy', 'Data Analysis', 'API Integration', 'Automation'],
    duration: '6 weeks',
  },
  {
    icon: Sparkles,
    title: 'ML for Trading Strategies',
    description: 'Apply machine learning techniques to develop predictive models and intelligent trading algorithms.',
    topics: ['ML Models', 'Feature Engineering', 'Model Validation', 'Deployment'],
    duration: '10 weeks',
  },
];

export function Courses() {
  return (
    <section id="courses" className="py-24 relative font-courses">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Upcoming Courses
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Comprehensive curriculum designed for Indian markets
          </p>
        </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <ScrollReveal key={index} delay={index * 0.15}>
              <div
                className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all duration-300 overflow-hidden"
              >
              {/* Coming Soon Ribbon */}
              <div className="absolute top-0 right-0 z-20">
                <div className="relative">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-bl-lg shadow-lg">
                    Coming Soon
                  </div>
                  <div className="absolute top-full right-0 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-blue-600"></div>
                </div>
              </div>

              {/* Icon */}
              <div className="mb-6 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500/40 group-hover:to-cyan-500/40 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300">
                <course.icon className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3 text-white">
                {course.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Topics */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {course.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-800/80 border border-white/5 rounded-lg text-xs text-gray-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="text-sm text-gray-500 mb-4">
                Duration: {course.duration}
              </div>

              {/* CTA */}
              <Button
                variant="ghost"
                className="w-full !text-gray-300 hover:!text-white hover:!bg-white/10 bg-transparent"
                onClick={() => {
                  const waitlistSection = document.getElementById('waitlist');
                  if (waitlistSection) {
                    waitlistSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Notify Me
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Decorative element */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl group-hover:scale-[1.8] group-hover:from-blue-500/50 group-hover:to-cyan-500/50 group-hover:blur-[60px] transition-all duration-500"></div>
            </div>
            </ScrollReveal>
          ))}
        </div>

        {/* View all courses link */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            disabled
            className="group border-white/40 hover:border-white/60 bg-transparent hover:bg-white/10 text-white hover:text-white border-2 transition-all duration-300 opacity-50 cursor-not-allowed"
          >
            <Lock className="mr-2 w-5 h-5" />
            View All Courses
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

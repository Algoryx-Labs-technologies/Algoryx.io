import React, { useState, useEffect, useRef } from 'react';
import { Code2, ShieldCheck, Layers, Handshake } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const benefits = [
  {
    icon: Code2,
    title: 'Engineering-First Delivery',
    description:
      'We ship production systems—trading bots, web apps, APIs, and cloud pipelines—with tests, observability, and clear handover documentation.',
  },
  {
    icon: Layers,
    title: 'End-to-End Tech Services',
    description:
      'One partner across automation, product development, AI/ML, DevOps, MVPs, and creative production—so you are not juggling multiple vendors.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for Real-World Scale',
    description:
      'Architectures designed for live traffic, broker integrations, security, and cost-aware infrastructure—not throwaway prototypes.',
  },
  {
    icon: Handshake,
    title: 'Transparent Process & Support',
    description:
      'Structured discovery, milestone demos, and post-launch support windows so your team understands and owns what we build.',
  },
];

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ target, suffix = '', duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = Date.now();
          const startValue = 0;
          const endValue = target;

          const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

            setCount(currentValue);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(endValue);
            }
          };

          requestAnimationFrame(animate);

          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      observer.disconnect();
    };
  }, [target, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function WhyAlgoryx() {
  return (
    <section id="why-algoryx" className="py-24 relative font-why-algoryx">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Why Algoryx Labs
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A technology partner for trading systems, digital products, AI, infrastructure, and launch-ready creative work.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 group-hover:scale-110 transition-all">
                    <benefit.icon className="w-7 h-7 text-blue-400" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="mt-20 relative">
            <div className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter target={10} suffix="+" />
                  </div>
                  <div className="text-gray-400">Projects Delivered</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter target={5} suffix="+" />
                  </div>
                  <div className="text-gray-400">Clients Served</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter target={10} suffix="+" />
                  </div>
                  <div className="text-gray-400">Core Service Verticals</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter target={100} suffix="%" />
                  </div>
                  <div className="text-gray-400">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

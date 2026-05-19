import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { Spotlight } from './ui/spotlight';
import { EncryptedText } from './ui/encrypted-text';

const heroMetrics = [
  { value: '100+', label: 'Projects Delivered' },
  { value: '50+', label: 'Clients Satisfied' },
  { value: '10+', label: 'Partnerships' },
  { value: '98%', label: 'Accuracy' },
  { value: '10+', label: 'Service Offerings' },
] as const;

function MetricCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-4 text-center min-w-[9.5rem] shrink-0">
      <span className="text-2xl sm:text-3xl font-bold tabular-nums bg-gradient-to-b from-white via-blue-50 to-cyan-200/80 bg-clip-text text-transparent">
        {value}
      </span>
      <span
        className="mt-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </span>
    </div>
  );
}

function HeroMetricsRibbon() {
  const marqueeItems = [...heroMetrics, ...heroMetrics];

  return (
    <div className="w-full mt-10 pt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Desktop / tablet: static ribbon */}
      <div className="hidden md:block relative mx-auto max-w-5xl">
        <div
          className="relative overflow-hidden border border-white/10 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 shadow-[0_8px_32px_rgba(59,130,246,0.12)] backdrop-blur-md"
          style={{
            clipPath:
              'polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />

          <div className="grid grid-cols-5 divide-x divide-white/10">
            {heroMetrics.map((metric) => (
              <MetricCell key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: scrolling ribbon marquee */}
      <div className="md:hidden relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />

        <div className="border-y border-cyan-500/25 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 py-1 shadow-[0_4px_24px_rgba(59,130,246,0.1)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div className="hero-metrics-marquee flex w-max">
            {marqueeItems.map((metric, index) => (
              <div
                key={`${metric.label}-${index}`}
                className="flex items-center shrink-0 border-r border-white/10"
              >
                <MetricCell value={metric.value} label={metric.label} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const scrollToConsultation = () => {
    const consultationSection = document.getElementById('work-with-labs');
    if (consultationSection) {
      consultationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center overflow-hidden font-hero">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Spotlight Effect */}
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#3b82f6" />

      <div className="container mx-auto px-6 py-12 lg:py-20 relative z-10 w-full flex flex-col items-center">
        {/* Top Section - Tagline */}
        <ScrollReveal>
          <div className="text-center mb-10 lg:mb-14">
            <p
              className="text-xs md:text-sm text-gray-400 dark:text-gray-500 font-light tracking-[0.2em] uppercase"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Engineering infrastructure for modern finance, digital businesses and scalable tech platforms.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Heading */}
        <ScrollReveal delay={0.1}>
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-hero-heading leading-tight mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Algorithms Over
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Opinion
              </span>
            </h1>
          </div>
        </ScrollReveal>

        {/* Middle Section - Content */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-col items-center text-center space-y-8 max-w-5xl w-full">
            <p className="text-xl md:text-2xl lg:text-3xl" style={{ fontFamily: 'Inter, sans-serif' }}>
              <EncryptedText
                text="Building scalable technology and Modern engineering for platforms, products, and infrastructure."
                encryptedClassName="text-gray-500 dark:text-gray-500"
                revealedClassName="text-gray-600 dark:text-gray-400"
                revealDelayMs={50}
              />
            </p>

            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 text-base md:text-lg px-8 md:px-9 h-12"
                style={{ fontFamily: 'Inter, sans-serif' }}
                onClick={scrollToConsultation}
              >
                <CalendarCheck className="mr-2 w-5 h-5" />
                Book Free Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <HeroMetricsRibbon />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

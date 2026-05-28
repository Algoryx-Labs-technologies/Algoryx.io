import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { Spotlight } from './ui/spotlight';
import { EncryptedText } from './ui/encrypted-text';
import { getCalButtonProps } from '../../lib/cal';
import { MetricsRibbon } from './MetricsRibbon';

const heroMetrics = [
  { value: '10+', label: 'Projects Delivered' },
  { value: '5+', label: 'Clients Satisfied' },
  { value: '2+', label: 'Partnerships' },
  { value: '100+', label: 'Accuracy' },
  { value: '10+', label: 'Service Offerings' },
] as const;

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center overflow-hidden font-hero" aria-labelledby="hero-heading">
      <p className="sr-only">
        Algoryx.io — official website of Algoryx Labs and Algoryx Tech (Algoryx Technologies). Engineering
        trading systems, AI, web platforms, and Algoryx Prime for India and global markets.
      </p>
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
            <h1 id="hero-heading" className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-hero-heading leading-tight mb-6 tracking-tight">
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
                revealMode="parallel"
                scrambleDurationMs={2000}
                scrambleTickMs={35}
              />
            </p>

            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 text-base md:text-lg px-8 md:px-9 h-12"
                style={{ fontFamily: 'Inter, sans-serif' }}
                {...getCalButtonProps()}
              >
                <CalendarCheck className="mr-2 w-5 h-5" />
                Book Free Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <MetricsRibbon metrics={heroMetrics} className="mt-10" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

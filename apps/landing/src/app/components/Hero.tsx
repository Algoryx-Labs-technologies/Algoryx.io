import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { Spotlight } from './ui/spotlight';
import { EncryptedText } from './ui/encrypted-text';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center overflow-hidden font-hero">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="#3b82f6"
      />
      
      <div className="container mx-auto px-6 py-12 lg:py-20 relative z-10 w-full flex flex-col items-center">
        {/* Top Section - Tagline */}
        <ScrollReveal>
          <div className="text-center mb-10 lg:mb-14">
          <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 font-light tracking-[0.2em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
          India's first edtech platform for algorithmic trading and quantitative research
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
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mb-12 lg:mb-16">
            <p className="text-xl md:text-2xl lg:text-3xl" style={{ fontFamily: 'Inter, sans-serif' }}>
              <EncryptedText
                text="Learn systematic trading and quantitative research for Indian markets."
                encryptedClassName="text-gray-500 dark:text-gray-500"
                revealedClassName="text-gray-600 dark:text-gray-400"
                revealDelayMs={50}
              />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 text-base md:text-lg px-8 md:px-9 h-12"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Join the Waitlist
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="group border-gray-300 dark:border-white/40 hover:border-gray-400 dark:hover:border-white/60 bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white hover:text-gray-900 dark:hover:text-white border-2 transition-all duration-300 text-base md:text-lg px-8 md:px-9 h-12"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Explore Courses
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">500+</div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-500">Early Signups</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">10+</div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-500">Expert Mentors</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">100%</div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-500">India Focused</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

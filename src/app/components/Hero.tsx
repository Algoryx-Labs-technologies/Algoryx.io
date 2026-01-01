import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { RotatingSphere } from './RotatingSphere';

export function Hero() {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden font-hero">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      {/* Rotating Sphere Background - Right Side */}
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden">
        <div className="relative w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] mr-0 lg:mr-12">
          {/* Glowing orb effect behind sphere */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-cyan-500/15 to-blue-500/20 rounded-full blur-3xl opacity-50"></div>
          
          {/* 3D Rotating Sphere */}
          <div className="absolute inset-0 flex items-center justify-center">
            <RotatingSphere />
          </div>
        </div>
      </div>
      
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
        </div>
      </div>
    </section>
  );
}

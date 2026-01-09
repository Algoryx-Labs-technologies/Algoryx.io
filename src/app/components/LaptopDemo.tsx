import React from 'react';
import { MacbookScroll } from './ui/macbook-scroll';
import { ScrollReveal } from './ScrollReveal';

export function LaptopDemo() {
  return (
    <section className="relative w-full py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Experience Algoryx
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See our platform in action
            </p>
          </div>
        </ScrollReveal>
        
        <div className="relative w-full max-w-5xl mx-auto mt-12">
          <MacbookScroll
            title={null}
            src={undefined}
            showGradient={false}
          />
        </div>
      </div>
      
      {/* Aesthetic dark gradient at the bottom */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[45vh] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.15) 80%, transparent 100%)'
        }}
      ></div>
    </section>
  );
}


import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Courses } from './components/Courses';
import { AIDoubtTool } from './components/AIDoubtTool';
import { WhyAlgoryx } from './components/WhyAlgoryx';
import { EducationDemo } from './components/EducationDemo';
import { TradingDemo } from './components/TradingDemo';
import { Waitlist } from './components/Waitlist';
import { WorkWithAlgoryxLabs } from './components/WorkWithAlgoryxLabs';
import { Labs } from './components/Labs';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        {/* Background gradient effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-700/15 rounded-full blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <Header />
          <Hero />
          <Features />
          {/* <EducationDemo /> */}
          <Courses />
          <Waitlist />
          <AIDoubtTool />
          <WhyAlgoryx />
          <TradingDemo />
          <Labs />
          <WorkWithAlgoryxLabs />
          <Footer />
        </div>
      </div>
    </div>
  );
}

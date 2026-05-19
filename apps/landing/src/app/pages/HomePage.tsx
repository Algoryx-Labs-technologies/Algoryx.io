import React from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { AIDoubtTool } from '../components/AIDoubtTool';
import { WhyAlgoryx } from '../components/WhyAlgoryx';
import { TradingDemo } from '../components/TradingDemo';
import { WorkWithAlgoryxLabs } from '../components/WorkWithAlgoryxLabs';
import { FAQ } from '../components/FAQ';
import { Labs } from '../components/Labs';
import { Footer } from '../components/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <div className="relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Header />
          <Hero />
          <Services />
          <AIDoubtTool />
          <WhyAlgoryx />
          <TradingDemo />
          <Labs />
          <WorkWithAlgoryxLabs />
          <FAQ />
          <Footer />
        </div>
      </div>
    </div>
  );
}

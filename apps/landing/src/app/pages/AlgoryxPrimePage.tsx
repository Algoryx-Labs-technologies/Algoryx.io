import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { ScrollReveal } from '../components/ScrollReveal';
import { Spotlight } from '../components/ui/spotlight';
import { MirrorShine } from '../components/prime/MirrorShine';
import { PrimePageShell } from '../components/prime/PrimePageShell';
import { PrimeFlipCard } from '../components/prime/PrimeFlipCard';
import { PrimeServicesSwap } from '../components/prime/PrimeServicesSwap';
import { PRIME_SERVICES } from '../../data/primeServices';
import { getCalButtonProps } from '../../lib/cal';

const TradingDemo = lazy(() =>
  import('../components/TradingDemo').then((m) => ({ default: m.TradingDemo }))
);

export function AlgoryxPrimePage() {
  return (
    <PrimePageShell>
      <Header />

      <main className="font-features overflow-x-hidden">
        <section className="relative pt-12 pb-8 md:pt-16 md:pb-10">
          <Spotlight className="-top-20 left-0 md:left-8 md:-top-32 fill-cyan-500/25" />
          <div className="container mx-auto px-6 max-w-6xl text-center relative">
            <ScrollReveal>
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-cyan-400 transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Link>
{/* 
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6">
                <TrendingUp className="w-3.5 h-3.5" />
                Algoryx Prime
              </div> */}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                  Built for serious traders
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Full-time traders and market investors across equities, forex, commodities, and derivatives.
                Explore each Prime service below — built for serious execution.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Suspense
          fallback={
            <div className="min-h-[420px] flex items-center justify-center text-gray-500 text-sm">
              Loading platform preview…
            </div>
          }
        >
          <TradingDemo embedded />
        </Suspense>

        <section className="container mx-auto px-6 max-w-6xl pb-10">
          <ScrollReveal delay={0.05}>
            <PrimeServicesSwap />
          </ScrollReveal>
        </section>

        <section className="container mx-auto px-6 max-w-6xl pb-6">
          <ScrollReveal delay={0.08}>
            <MirrorShine
              auto
              className="rounded-2xl border border-white/10 bg-slate-900/40 px-6 py-4 text-center backdrop-blur-sm"
            >
              <p className="relative z-10 text-sm text-gray-400">
                Indian &amp; global equities · Forex &amp; CFDs · Commodities &amp; futures · Crypto where
                relevant
              </p>
            </MirrorShine>
          </ScrollReveal>
        </section>

        <section className="container mx-auto px-6 max-w-6xl pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {PRIME_SERVICES.map((service, index) => (
              <ScrollReveal key={service.id} delay={index * 0.05} className="h-full">
                <PrimeFlipCard service={service} index={index} />
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollReveal>
              <MirrorShine
                auto
                className="text-center rounded-3xl border border-blue-500/25 bg-gradient-to-br from-slate-900/90 to-slate-800/70 p-10 md:p-12 backdrop-blur-md"
              >
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Not sure where to start?</h2>
                  <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                    We will map your broker, markets, and goals to the right Prime services.
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg shadow-cyan-500/25"
                    {...getCalButtonProps()}
                  >
                    Book Free Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </MirrorShine>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </PrimePageShell>
  );
}

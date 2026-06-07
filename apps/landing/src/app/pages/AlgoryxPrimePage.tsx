import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BookConsultationButton } from '../components/BookConsultationButton';
import { ScrollReveal } from '../components/ScrollReveal';
import { Spotlight } from '../components/ui/spotlight';
import { PrimePageShell } from '../components/prime/PrimePageShell';
import { PrimeFlipCard } from '../components/prime/PrimeFlipCard';
import { PrimeServicesSwap } from '../components/prime/PrimeServicesSwap';
import { PRIME_SERVICES } from '../../data/primeServices';

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

        <section className="container mx-auto max-w-6xl px-6 pb-6">
          <ScrollReveal delay={0.08}>
            <div className="mx-auto max-w-4xl rounded-full border border-white/[0.08] bg-slate-950/60 px-6 py-3.5 text-center shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-md md:px-10">
              <p className="text-xs font-medium tracking-wide text-gray-500 md:text-sm">
                Indian &amp; global equities
                <span className="mx-2 text-white/20">·</span>
                Forex &amp; CFDs
                <span className="mx-2 text-white/20">·</span>
                Commodities &amp; futures
                <span className="mx-2 text-white/20">·</span>
                Crypto where relevant
              </p>
            </div>
          </ScrollReveal>
        </section>

        <section className="container mx-auto max-w-6xl px-6 pb-20">
          <ScrollReveal delay={0.06}>
            <div className="mb-10 text-center md:mb-12">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-500">Platform capabilities</p>
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Everything serious traders need
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500 md:text-base">
                Hover a card to reveal the stack behind each service, then explore the full scope.
              </p>
            </div>
          </ScrollReveal>

          <div className="rounded-[2rem] border border-white/[0.06] bg-gradient-to-b from-slate-950/40 to-black/20 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-8">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {PRIME_SERVICES.map((service, index) => (
                <ScrollReveal key={service.id} delay={index * 0.04} className="h-full">
                  <PrimeFlipCard service={service} index={index} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <ScrollReveal>
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/90 p-10 text-center shadow-[0_24px_64px_rgba(0,0,0,0.4)] backdrop-blur-md md:p-12">
                <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gray-500">Get started</p>
                <h2 className="mb-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Not sure where to start?
                </h2>
                <p className="mx-auto mb-8 max-w-lg text-gray-500">
                  We will map your broker, markets, and goals to the right Prime services.
                </p>
                <BookConsultationButton />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </PrimePageShell>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Package,
  Route,
  Users,
} from 'lucide-react';
import type { PrimeService } from '../../../data/primeServices';
import { PRIME_SERVICES } from '../../../data/primeServices';
import { getPrimeStackIcons } from '../../../data/primeStackIcons';
import { Button } from '../ui/button';
import { ScrollReveal } from '../ScrollReveal';
import { Spotlight } from '../ui/spotlight';
import { MirrorShine } from './MirrorShine';
import { PrimeStackLogoRow } from './PrimeStackLogos';

type PrimeServiceDetailProps = {
  service: PrimeService;
};

export function PrimeServiceDetail({ service }: PrimeServiceDetailProps) {
  const Icon = service.icon;
  const stackIcons = getPrimeStackIcons(service.id);
  const currentIndex = PRIME_SERVICES.findIndex((s) => s.id === service.id);
  const prev = currentIndex > 0 ? PRIME_SERVICES[currentIndex - 1] : null;
  const next = currentIndex < PRIME_SERVICES.length - 1 ? PRIME_SERVICES[currentIndex + 1] : null;

  const scrollToConsultation = () => {
    window.location.href = '/#work-with-labs';
  };

  return (
    <div className="font-features">
      <section className="relative pt-10 pb-12 md:pt-14 md:pb-16 border-b border-white/5 overflow-hidden">
        <Spotlight className="-top-24 left-0 md:left-12 fill-blue-500/20" />
        <div className="container mx-auto px-6 max-w-5xl relative">
          <ScrollReveal>
            <Link
              to="/algoryx-prime"
              className="inline-flex items-center text-sm text-gray-500 hover:text-cyan-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Prime services
            </Link>

            <MirrorShine
              auto
              className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-slate-800/60 p-8 md:p-12 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            >
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 mb-8">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-blue-600/40 to-cyan-500/30 border border-white/20 flex items-center justify-center shadow-xl shadow-cyan-500/15 ring-1 ring-white/10">
                    <Icon className="w-8 h-8 text-cyan-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.22em] text-cyan-400 mb-2">{service.tagline}</p>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                      {service.title}
                    </h1>
                    <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl">
                      {service.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-4">
                    Technology &amp; infrastructure
                  </p>
                  <PrimeStackLogoRow icons={stackIcons} />
                </div>
              </div>
            </MirrorShine>
          </ScrollReveal>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-5xl pb-20 space-y-12 md:space-y-14">
        <ScrollReveal>
          <MirrorShine className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 md:p-8">
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Overview</p>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">{service.overview}</p>
            </div>
          </MirrorShine>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div className="grid lg:grid-cols-2 gap-6">
            <MirrorShine className="rounded-2xl border border-red-500/15 bg-gradient-to-br from-red-950/35 to-slate-950/50 p-6 md:p-8 h-full">
              <div className="relative z-10">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-red-300/90 mb-5">
                  <AlertCircle className="w-4 h-4" />
                  The challenge
                </h2>
                <ul className="space-y-3">
                  {service.problems.map((item) => (
                    <li
                      key={item}
                      className="text-sm md:text-base text-gray-400 leading-relaxed pl-4 border-l-2 border-red-500/30"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </MirrorShine>
            <MirrorShine className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-950/50 p-6 md:p-8 h-full">
              <div className="relative z-10">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-300/90 mb-5">
                  <Sparkles className="w-4 h-4" />
                  What you gain
                </h2>
                <ul className="space-y-3">
                  {service.solutions.map((item) => (
                    <li key={item} className="flex gap-3 text-sm md:text-base text-gray-200">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </MirrorShine>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white mb-6 flex items-center gap-3">
              <span className="h-px flex-1 max-w-[48px] bg-gradient-to-r from-cyan-500/60 to-transparent" />
              Capabilities
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
              {service.capabilities.map((cap, capIndex) => (
                <MirrorShine
                  key={cap.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 md:p-6 hover:border-cyan-500/20 transition-colors duration-300"
                >
                  <div className="relative z-10">
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-2xl font-bold bg-gradient-to-b from-cyan-400/40 to-transparent bg-clip-text text-transparent tabular-nums">
                        {String(capIndex + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-base font-semibold text-white">{cap.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {cap.items.map((item) => (
                        <li key={item} className="text-sm text-gray-400 leading-relaxed flex gap-2">
                          <span className="text-cyan-500/50 shrink-0">·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </MirrorShine>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            <MirrorShine className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 md:p-8">
              <div className="relative z-10">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white mb-5">
                  <Package className="w-4 h-4 text-blue-400" />
                  Deliverables
                </h2>
                <ul className="space-y-3">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex gap-3 text-sm md:text-base text-gray-400">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </MirrorShine>

            <MirrorShine className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 md:p-8">
              <div className="relative z-10">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white mb-5">
                  <Route className="w-4 h-4 text-cyan-400" />
                  How we work
                </h2>
                <ol className="space-y-4">
                  {service.process.map((step, stepIndex) => (
                    <li key={step.step} className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/50 to-cyan-600/40 text-sm font-bold text-white border border-white/15 shadow-md">
                        {stepIndex + 1}
                      </span>
                      <div className="pt-0.5 min-w-0">
                        <p className="text-gray-200 text-sm md:text-base leading-relaxed">{step.step}</p>
                        {step.duration && (
                          <p className="text-xs text-cyan-400/80 mt-1 font-medium">{step.duration}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </MirrorShine>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <MirrorShine className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-950/70 to-slate-900/50 p-6 md:p-8">
            <div className="relative z-10">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white mb-4">
                <Users className="w-4 h-4 text-gray-400" />
                Ideal for
              </h2>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {service.idealFor.map((label) => (
                  <span
                    key={label}
                    className="text-sm px-4 py-2 rounded-full border border-white/10 bg-black/40 text-gray-300 backdrop-blur-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </MirrorShine>
        </ScrollReveal>

        <ScrollReveal delay={0.14}>
          <MirrorShine
            auto
            className="rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-slate-900/95 to-slate-800/80 p-8 md:p-10 text-center shadow-[0_20px_60px_rgba(34,211,238,0.08)]"
          >
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                Ready to build {service.title}?
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm md:text-base">
                Book a consultation and we will scope your market, broker, and timeline.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg shadow-cyan-500/20"
                onClick={scrollToConsultation}
              >
                Start your project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </MirrorShine>
        </ScrollReveal>

        <nav className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-white/10">
          {prev ? (
            <Link
              to={`/algoryx-prime/${prev.id}`}
              className="group flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>
                <span className="block text-xs text-gray-600">Previous</span>
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/algoryx-prime/${next.id}`}
              className="group flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors sm:text-right sm:ml-auto"
            >
              <span>
                <span className="block text-xs text-gray-600">Next</span>
                {next.title}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  );
}

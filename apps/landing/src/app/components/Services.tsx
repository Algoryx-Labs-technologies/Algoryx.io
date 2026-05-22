import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { Button } from './ui/button';
import { SERVICES } from '../../data/services';

const ServiceStackLogos = lazy(() =>
  import('./ServiceStackLogos').then((m) => ({ default: m.ServiceStackLogos }))
);

export function Services() {
  return (
    <section id="services" className="py-14 md:py-16 relative font-features scroll-mt-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Services Algoryx Labs Provides
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              End-to-end engineering for trading systems, products, AI, infrastructure, and creative production.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <Suspense fallback={<div className="mb-10 md:mb-12 h-12" aria-hidden />}>
            <ServiceStackLogos />
          </Suspense>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {SERVICES.map((service, index) => (
            <ScrollReveal key={service.id} delay={index * 0.06}>
              <Link
                to={`/service-details#${service.id}`}
                className="group relative flex h-full flex-col bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-5 md:p-5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_24px_rgba(59,130,246,0.22)]"
              >
                <div className="mb-3 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                  <service.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-base md:text-lg font-bold mb-2 text-white group-hover:text-cyan-100 transition-colors leading-snug">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm flex-1 line-clamp-3">
                  {service.shortDescription}
                </p>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-cyan-400/90 group-hover:text-cyan-300">
                  Learn more
                  <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-300 pointer-events-none" />
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.15}>
          <div className="text-center mt-10 md:mt-11">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 text-base px-7 h-11"
            >
              <Link to="/service-details">
                Explore All Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

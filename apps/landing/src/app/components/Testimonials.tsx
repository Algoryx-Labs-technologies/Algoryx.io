import React from 'react';
import { Star } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { TESTIMONIALS, type Testimonial } from '../../data/testimonials';

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="group relative flex w-[280px] sm:w-[300px] md:w-[320px] shrink-0 flex-col items-center rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_24px_rgba(59,130,246,0.22)]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-cyan-500/0 transition-all duration-300 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 pointer-events-none" />

      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-500/25 to-cyan-500/25 text-sm font-semibold text-cyan-100">
        {item.initials}
      </div>

      <p className="relative z-10 mt-4 text-sm leading-relaxed text-gray-300 line-clamp-5">
        &ldquo;{item.quote}&rdquo;
      </p>

      <div className="relative z-10 mt-4 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-cyan-400 text-cyan-400" />
        ))}
      </div>

      <div className="relative z-10 mt-4">
        <p className="font-semibold text-white">{item.name}</p>
      </div>
    </article>
  );
}

export function Testimonials() {
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" className="py-14 md:py-16 relative font-features scroll-mt-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl mb-10 md:mb-12">
        <ScrollReveal>
          <div className="text-center">
            <span className="inline-flex items-center px-3 md:px-4 py-1.5 bg-cyan-500/10 border border-cyan-400/40 rounded-full text-cyan-200 text-xs md:text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                What Our Clients Say
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Hear from founders, CTOs, and builders who trust Algoryx Labs for trading systems, products, and
              production-grade engineering.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />

        <div className="overflow-hidden py-2">
          <div className="testimonials-marquee flex w-max gap-4 md:gap-5 px-4">
            {marqueeItems.map((item, index) => (
              <TestimonialCard key={`${item.id}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { lazy, Suspense, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import { SERVICES } from '../../data/services';
import { ServiceDeviceMockup } from './ServiceDeviceMockup';

const ServiceStackLogos = lazy(() =>
  import('./ServiceStackLogos').then((m) => ({ default: m.ServiceStackLogos }))
);

const SERVICE_COUNT = SERVICES.length;

export function Services() {
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.min(
      SERVICE_COUNT - 1,
      Math.max(0, Math.floor(latest * SERVICE_COUNT))
    );
    setActiveIndex((prev) => (prev === index ? prev : index));
  });

  const activeService = SERVICES[activeIndex];
  const phoneOnLeft = activeIndex % 2 === 0;

  return (
    <section id="services" className="relative font-features scroll-mt-20">
      <div
        ref={scrollTrackRef}
        className="services-scroll-track relative"
        style={{ '--services-count': SERVICE_COUNT } as React.CSSProperties}
        aria-label="Services scroll showcase"
      >
        <div className="container mx-auto px-6 max-w-7xl pt-14 md:pt-16 pb-4 md:pb-6">
          <ScrollReveal>
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Services Algoryx Labs Provides
                </span>
              </h2>
              <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                SaaS platforms, business software, AI, DevOps, MVPs, and video production—built for companies that need to ship and scale.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <Suspense fallback={<div className="h-12" aria-hidden />}>
              <ServiceStackLogos compact />
            </Suspense>
          </ScrollReveal>
        </div>

        <div className="sticky top-20 md:top-24 z-10">
          <div className="container mx-auto px-6 max-w-7xl w-full py-2 md:py-4">
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 260, damping: 32 }}
                className={cn(
                  'flex justify-center lg:justify-end',
                  phoneOnLeft ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-2 lg:row-start-1'
                )}
              >
                <ServiceDeviceMockup service={activeService} />
              </motion.div>

              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 260, damping: 32 }}
                className={cn(
                  'flex flex-col justify-center max-w-xl mx-auto lg:mx-0 text-center lg:text-left',
                  phoneOnLeft ? 'lg:col-start-2 lg:row-start-1' : 'lg:col-start-1 lg:row-start-1'
                )}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-400/90 mb-3">
                      {activeService.tagline}
                    </p>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                      {activeService.title}
                    </h3>
                    <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-6">
                      {activeService.shortDescription}
                    </p>
                    <Link
                      to={`/service-details#${activeService.id}`}
                      className="inline-flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Learn more
                      <ArrowRight className="ml-1.5 w-4 h-4" />
                    </Link>
                  </motion.div>
                </AnimatePresence>

                <div
                  className="flex items-center justify-center lg:justify-start gap-2 mt-6 md:mt-8"
                  role="tablist"
                  aria-label="Service progress"
                >
                  {SERVICES.map((service, index) => (
                    <button
                      key={service.id}
                      type="button"
                      role="tab"
                      aria-selected={index === activeIndex}
                      aria-label={`${service.title}, step ${index + 1} of ${SERVICE_COUNT}`}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-300',
                        index === activeIndex
                          ? 'w-8 bg-gradient-to-r from-blue-500 to-cyan-400'
                          : 'w-1.5 bg-white/20 hover:bg-white/35'
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl pb-14 md:pb-16">
        <ScrollReveal delay={0.15}>
          <div className="text-center mt-4 md:mt-6">
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

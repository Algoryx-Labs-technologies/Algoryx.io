import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BookConsultationButton } from '../components/BookConsultationButton';
import { Button } from '../components/ui/button';
import { ScrollReveal } from '../components/ScrollReveal';
import { Spotlight } from '../components/ui/spotlight';
import { ServiceStackCard } from '../components/ServiceStackCard';
import { cn } from '../components/ui/utils';
import { SERVICES, type Service } from '../../data/services';

function serviceNavLabel(title: string): string {
  return title.replace(/\s+Agency$/i, '').replace(/\s+Services$/i, '').trim();
}

function PageBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-blue-700/8 rounded-full blur-[100px]" />
    </div>
  );
}

function ServiceNavItem({
  service,
  isActive,
  onSelect,
}: {
  service: Service;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = service.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(service.id)}
      aria-current={isActive ? 'true' : undefined}
      className={cn(
        'group flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300',
        isActive
          ? 'border-white/30 bg-white/[0.06] shadow-[0_0_24px_rgba(255,255,255,0.04)]'
          : 'border-white/[0.06] bg-slate-950/30 hover:border-white/15 hover:bg-white/[0.03]'
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300',
          isActive
            ? 'border-white/20 bg-gradient-to-br from-blue-600/30 to-cyan-500/20'
            : 'border-white/10 bg-slate-900/60 group-hover:border-white/15'
        )}
      >
        <Icon className={cn('h-4 w-4', isActive ? 'text-cyan-300' : 'text-gray-400 group-hover:text-gray-300')} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm font-medium', isActive ? 'text-white' : 'text-gray-300')}>
          {serviceNavLabel(service.title)}
        </p>
        <p className="truncate text-xs text-gray-500">{service.tagline}</p>
      </div>
      {isActive && <ChevronRight className="h-4 w-4 shrink-0 text-white/60" />}
    </button>
  );
}

function ServiceVisualHero({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/50 md:min-h-[260px]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_40%,transparent_100%)] opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />

      <motion.div
        key={service.id}
        initial={{ opacity: 0, scale: 0.88, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="relative h-28 w-28 rotate-45 rounded-[1.75rem] border border-white/15 bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-slate-950 shadow-[0_0_80px_rgba(59,130,246,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] md:h-32 md:w-32 md:rounded-[2rem]">
          <div className="absolute inset-2 rounded-[1.25rem] border border-white/5 bg-gradient-to-br from-blue-600/10 to-cyan-500/5 md:rounded-[1.5rem]" />
          <div className="flex h-full w-full -rotate-45 items-center justify-center">
            <Icon className="h-10 w-10 text-cyan-300 md:h-12 md:w-12" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ServiceDetailPanel({ service }: { service: Service }) {
  const capabilitiesLabel =
    service.id === 'saas-development' || service.id === 'ai-ml' ? 'Services' : 'Key capabilities';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
        className="space-y-6"
      >
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-400/90">{service.tagline}</p>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{service.title}</h2>
        </div>

        <p className="text-base leading-relaxed text-gray-300">{service.shortDescription}</p>
        <p className="text-sm leading-relaxed text-gray-500">{service.overview}</p>

        <ServiceVisualHero service={service} />
        <ServiceStackCard service={service} />

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 md:p-6">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              {capabilitiesLabel}
            </h3>
            <ul className="space-y-2.5">
              {service.highlights.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-gray-400">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/80" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 md:p-6">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              What you receive
            </h3>
            <ul className="space-y-2.5">
              {service.deliverables.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-gray-400">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-400/80" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 md:p-6">
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">How we work</h3>
          <ol className="grid gap-3 sm:grid-cols-2">
            {service.process.map((step, stepIndex) => (
              <li
                key={step}
                className="flex gap-3 rounded-xl border border-white/[0.06] bg-black/30 p-4 text-sm text-gray-400"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-xs font-bold text-cyan-300">
                  {stepIndex + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function ServiceDetailsPage() {
  const location = useLocation();
  const [activeId, setActiveId] = useState(SERVICES[0].id);

  const selectService = useCallback((id: string) => {
    setActiveId(id);
    window.history.replaceState(null, '', `#${id}`);
  }, []);

  useEffect(() => {
    if (location.hash === '#trading-bots') {
      window.location.replace('/service-details#saas-development');
      return;
    }

    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const id = location.hash.replace('#', '');
    const match = SERVICES.find((s) => s.id === id);
    if (match) {
      setActiveId(id);
      setTimeout(() => {
        document.getElementById('service-explorer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.hash]);

  const activeService = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0];

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300">
      <PageBackground />
      <div className="relative z-10">
        <Header />

        <main className="font-features">
          <section className="relative overflow-hidden pt-10 pb-8 md:pt-14 md:pb-12">
            <Spotlight className="-top-32 left-1/2 -translate-x-1/2 fill-blue-500/15" />
            <div className="container mx-auto max-w-5xl px-6">
              <ScrollReveal>
                <Link
                  to="/#services"
                  className="mb-8 inline-flex items-center text-sm text-gray-500 transition-colors hover:text-cyan-400"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to services
                </Link>

                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/90 p-8 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl md:rounded-[2.5rem] md:p-14">
                  <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
                  <div className="absolute -bottom-20 left-0 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl" />

                  <div className="relative text-center">
                    <span className="mb-6 inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs tracking-wide text-gray-400">
                      Full-service engineering partner
                    </span>
                    <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                      <span className="bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                        The modern platform
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        for your next build
                      </span>
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg">
                      SaaS platforms, web and mobile apps, AI automation, DevOps, MVPs, and video production—
                      engineered with the polish and reliability of a premium SaaS product.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                      <BookConsultationButton />
                      <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="h-11 rounded-full border-white/20 bg-transparent px-7 text-white hover:bg-white/10"
                      >
                        <Link to="/#services">View on homepage</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          <section id="service-explorer" className="scroll-mt-24 pb-20 md:pb-28">
            <div className="container mx-auto max-w-7xl px-6">
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14 xl:grid-cols-[minmax(0,380px)_1fr]">
                <ScrollReveal className="lg:sticky lg:top-28 lg:self-start">
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-500">Our capabilities</p>
                  <h2 className="mb-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
                    Simplify delivery with our services
                  </h2>
                  <p className="mb-8 text-sm leading-relaxed text-gray-500 md:text-base">
                    Select a capability to explore scope, deliverables, and how we work—each built for teams that
                    expect SaaS-grade quality.
                  </p>

                  <nav className="space-y-2" aria-label="Service categories">
                    {SERVICES.map((service) => (
                      <ServiceNavItem
                        key={service.id}
                        service={service}
                        isActive={service.id === activeId}
                        onSelect={selectService}
                      />
                    ))}
                  </nav>
                </ScrollReveal>

                <ScrollReveal delay={0.08}>
                  <div
                    id={activeService.id}
                    className="scroll-mt-28 rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/50 to-slate-950/80 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-8 lg:p-10"
                  >
                    <ServiceDetailPanel service={activeService} />
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          <section className="pb-24">
            <div className="container mx-auto max-w-3xl px-6">
              <ScrollReveal>
                <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/90 to-slate-900/70 p-10 text-center md:p-12">
                  <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">Ready to start a project?</h2>
                  <p className="mx-auto mb-8 max-w-lg text-gray-400">
                    Book a free consultation and we will help you choose the right service mix for your goals.
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <BookConsultationButton />
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="h-11 rounded-full border-white/20 px-7 text-white hover:bg-white/10"
                    >
                      <Link to="/#services">View services on homepage</Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

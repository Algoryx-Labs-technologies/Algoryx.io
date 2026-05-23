import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { ScrollReveal } from '../components/ScrollReveal';
import { SERVICES } from '../../data/services';
import { StackIconRow } from '../components/StackIconRow';

function serviceNavLabel(title: string): string {
  return title.replace(/\s+Agency$/i, '').replace(/\s+Services$/i, '').trim();
}

function PageBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl" />
    </div>
  );
}

export function ServiceDetailsPage() {
  const location = useLocation();

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
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.hash]);

  const scrollToConsultation = () => {
    window.location.href = '/#work-with-labs';
  };

  const D = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={className}>{children}</div>
  );

  return (
    <D className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      <PageBackground />
      <D className="relative z-10">
        <Header />

        <main className="font-features">
          <section className="pt-12 pb-16 md:pt-16 md:pb-20">
            <D className="container mx-auto px-6 max-w-4xl text-center">
              <ScrollReveal>
                <Link
                  to="/#services"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-cyan-400 transition-colors mb-8"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to services
                </Link>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                    Service Details
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  In-depth overview of every capability Algoryx Labs offers—SaaS platforms, web and mobile apps, AI
                  and automation, DevOps, MVPs, and video production.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <nav className="mt-10 flex flex-wrap justify-center gap-2 md:gap-3">
                  {SERVICES.map((service) => (
                    <a
                      key={service.id}
                      href={`#${service.id}`}
                      className="px-3 py-1.5 text-xs md:text-sm rounded-full border border-white/10 bg-slate-900/40 text-gray-400 hover:text-white hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all"
                    >
                      {serviceNavLabel(service.title)}
                    </a>
                  ))}
                </nav>
              </ScrollReveal>
            </D>
          </section>

          <D className="container mx-auto px-6 max-w-4xl pb-24 space-y-20 md:space-y-28">
            {SERVICES.map((service, index) => (
              <ScrollReveal key={service.id} delay={index * 0.05}>
                <article
                  id={service.id}
                  className="scroll-mt-28 relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-800/30 backdrop-blur-sm p-8 md:p-10"
                >
                  <D className="flex items-start gap-4 mb-6">
                    <D className="w-14 h-14 shrink-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center border border-white/10">
                      <service.icon className="w-7 h-7 text-blue-400" />
                    </D>
                    <D>
                      <p className="text-xs uppercase tracking-wider text-cyan-400/80 mb-1">{service.tagline}</p>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">{service.title}</h2>
                    </D>
                  </D>

                  <p className="text-gray-300 leading-relaxed mb-4">{service.shortDescription}</p>
                  <p className="text-gray-400 leading-relaxed mb-8">{service.overview}</p>

                  <StackIconRow icons={service.stackIcons} label="Tech stack & platforms" />

                  <D className="grid md:grid-cols-2 gap-8">
                    <D>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                        {service.id === 'saas-development' || service.id === 'ai-ml'
                          ? 'Services'
                          : 'Key capabilities'}
                      </h3>
                      <ul className="space-y-3">
                        {service.highlights.map((item) => (
                          <li key={item} className="flex gap-2.5 text-sm text-gray-400">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </D>
                    <D>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                        What you receive
                      </h3>
                      <ul className="space-y-3">
                        {service.deliverables.map((item) => (
                          <li key={item} className="flex gap-2.5 text-sm text-gray-400">
                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </D>
                  </D>

                  <D className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">How we work</h3>
                    <ol className="grid sm:grid-cols-2 gap-4">
                      {service.process.map((step, stepIndex) => (
                        <li
                          key={step}
                          className="flex gap-3 text-sm text-gray-400 bg-slate-950/40 rounded-xl p-4 border border-white/5"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-xs font-bold text-cyan-300">
                            {stepIndex + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </D>
                </article>
              </ScrollReveal>
            ))}
          </D>

          <section className="pb-24">
            <D className="container mx-auto px-6 max-w-3xl">
              <ScrollReveal>
                <D className="text-center rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-10 md:p-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to start a project?</h2>
                  <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                    Book a free consultation and we will help you choose the right service mix for your goals.
                  </p>
                  <D className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0"
                      onClick={scrollToConsultation}
                    >
                      Book Free Consultation
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
                      <Link to="/#services">View services on homepage</Link>
                    </Button>
                  </D>
                </D>
              </ScrollReveal>
            </D>
          </section>
        </main>

        <Footer />
      </D>
    </D>
  );
}

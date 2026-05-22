import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, Crown } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

function PrimeDeskTerminal() {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const terminalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineIndexRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setShouldAnimate(true);
          setHasAnimated(true);
        } else if (!entry.isIntersecting && hasAnimated) {
          setShouldAnimate(false);
        } else if (entry.isIntersecting && hasAnimated) {
          setShouldAnimate(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!shouldAnimate) {
      if (terminalIntervalRef.current) {
        clearInterval(terminalIntervalRef.current);
        terminalIntervalRef.current = null;
      }
      if (terminalTimeoutRef.current) {
        clearTimeout(terminalTimeoutRef.current);
        terminalTimeoutRef.current = null;
      }
      return;
    }

    let isMounted = true;

    const deskMessages = [
      '[PRIME] Algoryx Prime Desk — trader session authenticated',
      '[DESK] Equities · forex · commodities · derivatives — all venues live',
      '[AUTO] Strategy rules deployed | execution latency under 500ms',
      '[SCAN] Custom screener active | 512 symbols monitored continuously',
      '[RISK] Exposure capped at 42% | drawdown within desk limits',
      '[BTST] Walk-forward validation passed | out-of-sample Sharpe 1.72',
      '[PAPER] Live feed simulation running | zero capital at risk today',
      '[LIVE] Broker bridge synced | orders routing to production stack',
    ];

    lineIndexRef.current = 0;

    const addLine = () => {
      if (!isMounted) return;

      const index = lineIndexRef.current;
      if (index < deskMessages.length) {
        const message = deskMessages[index];
        if (message) {
          setTerminalLines((prev) => [...prev, message].slice(-8));
        }
        lineIndexRef.current = index + 1;
      } else {
        lineIndexRef.current = 0;
        setTerminalLines([]);
      }
    };

    terminalTimeoutRef.current = setTimeout(() => {
      if (isMounted) {
        addLine();
        terminalIntervalRef.current = setInterval(addLine, 2500);
      }
    }, 1000);

    return () => {
      isMounted = false;
      if (terminalTimeoutRef.current) clearTimeout(terminalTimeoutRef.current);
      if (terminalIntervalRef.current) clearInterval(terminalIntervalRef.current);
    };
  }, [shouldAnimate]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-full sm:max-w-xl md:max-w-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl overflow-hidden shadow-2xl relative"
    >
      <div className="flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 bg-slate-800/50 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 rounded-full bg-green-500/80" />
        </div>
        <span
          className="ml-2 text-xs sm:text-sm text-gray-400"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Algoryx Prime Desk
        </span>
      </div>

      <div
        className="p-4 sm:p-6 md:p-8 text-xs sm:text-sm md:text-base bg-black/30 relative overflow-hidden min-h-[200px]"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="text-gray-300 leading-relaxed space-y-1">
          <div className="text-green-400 mb-2">
            <span className="text-cyan-400">trader@prime</span>
            <span className="text-gray-500">:</span>
            <span className="text-blue-400">~/desk</span>
            <span className="text-gray-500">$</span>
            <span className="ml-2 text-gray-400">prime_desk --live</span>
          </div>

          {terminalLines.length === 0 && (
            <div className="text-gray-500 animate-pulse">
              <span className="inline-block w-2 h-4 bg-gray-500 mr-1" />
              Initializing Prime desk infrastructure...
            </div>
          )}

          {terminalLines.map((line, index) => {
            if (typeof line !== 'string') return null;

            let lineColor = 'text-gray-300';
            if (line.includes('[PRIME]')) lineColor = 'text-amber-300';
            else if (line.includes('[DESK]')) lineColor = 'text-cyan-300';
            else if (line.includes('[AUTO]')) lineColor = 'text-blue-300';
            else if (line.includes('[SCAN]')) lineColor = 'text-yellow-400';
            else if (line.includes('[RISK]')) lineColor = 'text-orange-400';
            else if (line.includes('[BTST]')) lineColor = 'text-purple-300';
            else if (line.includes('[PAPER]')) lineColor = 'text-green-300';
            else if (line.includes('[LIVE]')) lineColor = 'text-green-400';

            return (
              <div key={`line-${index}-${line.slice(0, 12)}`} className={lineColor}>
                {line}
              </div>
            );
          })}

          {shouldAnimate && (
            <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}

/** Each line is exactly 12 words for balanced layout */
const PRIME_DESK_POINTS = [
  'Your dedicated Prime desk for equities, forex, commodities, and derivative markets worldwide.',
  'Full execution stack with broker APIs, automation, screeners, dashboards, and live alerts.',
  'Rigorous backtests and walk-forward tuning before live deploy with paper-trade validation gates.',
  'Eight engineered Prime services from broker integration through monitoring and production support.',
] as const;

function PrimeDeskBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 dark:opacity-20" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,rgba(59,130,246,0.35),transparent_65%)]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(6,182,212,0.25) 0%, transparent 40%), radial-gradient(circle at 75% 55%, rgba(37,99,235,0.3) 0%, transparent 45%)',
        }}
      />
    </div>
  );
}

export function Labs() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shineKey, setShineKey] = useState(0);
  const hasShinedRef = useRef(false);
  const shineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasShinedRef.current) {
          hasShinedRef.current = true;
          shineTimerRef.current = setTimeout(() => setShineKey(1), 600);
        }
      },
      { threshold: 0.2, rootMargin: '-40px 0px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (shineTimerRef.current) clearTimeout(shineTimerRef.current);
    };
  }, []);

  return (
    <section id="prime" className="py-12 md:py-16 lg:py-24 relative font-labs scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div
          ref={cardRef}
          className="group relative bg-gradient-to-br from-blue-600/10 to-cyan-500/10 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-12 lg:py-12 overflow-hidden transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_28px_rgba(34,211,238,0.18)]"
        >
          <div className="labs-orb-float absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
          <PrimeDeskBackdrop />

          <div
            className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-yellow-500/15 text-amber-100 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] shadow-[0_0_20px_rgba(251,191,36,0.2)]"
            aria-label="Premium offering"
          >
            <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            Premium
          </div>

          <div className="relative z-10 mb-6 md:mb-6 flex justify-center lg:justify-start">
            <BrandLogo className="[&_img]:!h-10 [&_img]:!min-h-0 sm:[&_img]:!h-11 md:[&_img]:!h-12 [&_img]:max-w-[12rem]" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="space-y-4">
              {/* <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-cyan-500/10 border border-cyan-400/40 rounded-full text-cyan-200 text-xs md:text-sm font-medium">
                <Crown className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />
                Algoryx Prime
              </span> */}

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                <span className="text-white">Algoryx Prime Desk for</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent">
                  Serious Market Operators
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
                A focused trading desk for full-time traders and investors—we engineer broker connectivity,
                automation, validation, and monitoring as one production stack, not disconnected tools.
              </p>

              <div className="space-y-3 md:space-y-3.5 pt-1">
                {PRIME_DESK_POINTS.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-gray-300 text-sm sm:text-[15px] leading-relaxed group"
                  >
                    <span
                      className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${index % 2 === 0 ? 'bg-cyan-400' : 'bg-blue-400'}`}
                    />
                    <span className="group-hover:text-cyan-50/95 transition-colors">{item}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 text-sm sm:text-base px-6 sm:px-8 h-10 sm:h-12 w-full sm:w-auto shadow-lg shadow-cyan-500/15"
              >
                <Link to="/algoryx-prime">
                  Visit Prime Desk
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-end mt-6 lg:mt-0">
              <PrimeDeskTerminal />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-2xl md:rounded-3xl transition-all duration-300 pointer-events-none" />

          {shineKey > 0 && (
            <div className="absolute inset-0 pointer-events-none z-20 rounded-2xl md:rounded-3xl overflow-hidden">
              <div
                className="absolute w-full h-full"
                style={{
                  background:
                    'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(255, 255, 255, 0.25) 50%, transparent 70%, transparent 100%)',
                  transform: 'translateX(-100%) translateY(-100%) skewX(-45deg)',
                  animation: 'mirrorShine 2s ease-out forwards',
                  animationDelay: '0.3s',
                  width: '200%',
                  height: '200%',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

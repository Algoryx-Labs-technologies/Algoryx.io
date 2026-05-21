import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { ArrowRight, Lock, Crown } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

function BloombergTerminal() {
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

    const tradingMessages = [
      '[DESK] Algoryx Quant Research — session authenticated',
      '[ALPHA] Proprietary signal engine online | NIFTY · BANKNIFTY',
      '[SIGNAL] Long bias confirmed @ 18,450.25 | confidence 0.91',
      '[EXEC] Block routed: BUY 10 NIFTY50 @ 18,450.25',
      '[FILL] Institutional fill confirmed | slippage 0.8 bps',
      '[PNL] Intraday alpha: +₹1,250.00 (+0.68%)',
      '[RISK] Gross exposure capped at 45.2% | VaR within limits',
      '[METRICS] Sharpe 1.85 | Sortino 2.14 | Max DD -2.3%',
    ];

    lineIndexRef.current = 0;

    const addLine = () => {
      if (!isMounted) return;

      const index = lineIndexRef.current;
      if (index < tradingMessages.length) {
        const message = tradingMessages[index];
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
          Algoryx Quant Terminal
        </span>
      </div>

      <div
        className="p-4 sm:p-6 md:p-8 text-xs sm:text-sm md:text-base bg-black/30 relative overflow-hidden min-h-[200px]"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="text-gray-300 leading-relaxed space-y-1">
          <div className="text-green-400 mb-2">
            <span className="text-cyan-400">algoryx@quant</span>
            <span className="text-gray-500">:</span>
            <span className="text-blue-400">~/trading</span>
            <span className="text-gray-500">$</span>
            <span className="ml-2 text-gray-400">python quant_trader.py</span>
          </div>

          {terminalLines.length === 0 && (
            <div className="text-gray-500 animate-pulse">
              <span className="inline-block w-2 h-4 bg-gray-500 mr-1" />
              Initializing institutional research stack...
            </div>
          )}

          {terminalLines.map((line, index) => {
            if (typeof line !== 'string') return null;

            let lineColor = 'text-gray-300';
            if (line.includes('[DESK]')) lineColor = 'text-cyan-300';
            else if (line.includes('[ALPHA]')) lineColor = 'text-blue-300';
            else if (line.includes('[SIGNAL]')) lineColor = 'text-yellow-400';
            else if (line.includes('[EXEC]')) lineColor = 'text-purple-400';
            else if (line.includes('[FILL]')) lineColor = 'text-green-400';
            else if (line.includes('[PNL]')) lineColor = 'text-green-300';
            else if (line.includes('[RISK]')) lineColor = 'text-orange-400';
            else if (line.includes('[METRICS]')) lineColor = 'text-blue-300';

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

const premiumHighlights = [
  'Proprietary strategy research & multi-asset optimization',
  'Production ML pipelines for live market inference',
  'Institutional backtesting, TCA & performance attribution',
  'Enterprise risk, exposure & compliance architecture',
] as const;

function LabsMapBackdrop() {
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
  const labsCardRef = useRef<HTMLDivElement>(null);
  const [shineKey, setShineKey] = useState(0);
  const hasShinedRef = useRef(false);
  const shineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = labsCardRef.current;
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
    <section id="labs" className="py-12 md:py-16 lg:py-24 relative font-labs scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div
          ref={labsCardRef}
          className="group relative bg-gradient-to-br from-blue-600/10 to-cyan-500/10 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl px-6 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-12 lg:py-12 overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_24px_rgba(59,130,246,0.22)]"
        >
          <div className="labs-orb-float absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
          <LabsMapBackdrop />

          <div className="relative z-10 mb-6 md:mb-6 flex justify-center lg:justify-start">
            <BrandLogo className="[&_img]:!h-10 [&_img]:!min-h-0 sm:[&_img]:!h-11 md:[&_img]:!h-12 [&_img]:max-w-[12rem]" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-amber-500/10 border border-amber-400/40 rounded-full text-amber-200 text-xs md:text-sm font-medium">
                <Crown className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />
                Top Algoryx Labs Service
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-white">Institutional-Grade Quant</span>
                <br />
                <span className="text-cyan-300">&amp; AI Research Desk</span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
                A niche, premium offering for funds, prop desks, and serious market participants—bespoke
                alpha models, execution systems, and risk architecture engineered for the financial world,
                not generic software shops.
              </p>

              <div className="space-y-2 md:space-y-3">
                {premiumHighlights.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 md:gap-3 text-gray-300 text-sm sm:text-base group"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse ${index % 2 === 0 ? 'bg-blue-400' : 'bg-cyan-400'}`}
                    />
                    <span className="group-hover:text-cyan-100/90 transition-colors">{item}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                disabled
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 text-sm sm:text-base px-6 sm:px-8 h-10 sm:h-12 w-full sm:w-auto opacity-50 cursor-not-allowed"
              >
                <Lock className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Visit Algoryx Labs
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-end mt-6 lg:mt-0">
              <BloombergTerminal />
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

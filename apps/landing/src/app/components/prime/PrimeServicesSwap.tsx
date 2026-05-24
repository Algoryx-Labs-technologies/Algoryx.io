import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PRIME_SERVICES, type PrimeService } from '../../../data/primeServices';

const VISIBLE_COUNT = 3;
const SWAP_INTERVAL_MS = 1600;

type ServiceCardProps = {
  service: PrimeService;
  index: number;
};

function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-800/85 px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.04, duration: 0.2 }}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-600/25 to-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
      >
        <Icon className="h-4 w-4 text-cyan-300" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.06, duration: 0.2 }}
        className="min-w-0 flex-1 text-left"
      >
        <p className="truncate text-sm font-semibold text-white">{service.title}</p>
        <p className="truncate text-xs text-gray-400">{service.tagline}</p>
      </motion.div>

      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.08, duration: 0.18 }}
        className="shrink-0 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold tabular-nums text-cyan-300/90"
      >
        {String(index + 1).padStart(2, '0')}
      </motion.span>
    </motion.div>
  );
}

export function PrimeServicesSwap() {
  const [cards, setCards] = useState<PrimeService[]>(() => PRIME_SERVICES.slice(0, VISIBLE_COUNT));
  const nextServiceRef = useRef(VISIBLE_COUNT);
  const swapSlotRef = useRef(VISIBLE_COUNT - 1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const interval = setInterval(() => {
      const slot = swapSlotRef.current;
      swapSlotRef.current = slot === 0 ? VISIBLE_COUNT - 1 : slot - 1;

      const nextIndex = nextServiceRef.current % PRIME_SERVICES.length;
      const nextService = PRIME_SERVICES[nextIndex];
      nextServiceRef.current += 1;

      setCards((prev) => {
        const updated = [...prev];
        updated[slot] = nextService;
        return updated;
      });
    }, SWAP_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  const serviceIndex = (cardIndex: number) =>
    PRIME_SERVICES.findIndex((s) => s.id === cards[cardIndex]?.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="relative mx-auto max-w-md px-4"
    >
      <p className="mb-6 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 sm:text-xs">
        Prime services we deliver
      </p>

      <motion.div
        className="relative flex min-h-[320px] flex-col items-center justify-center py-10 sm:min-h-[360px] sm:py-12"
        aria-live="polite"
        aria-label="Rotating preview of Algoryx Prime services"
      >
        {/* Soft gradient orb — matches Prime page cyan/blue theme */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-blue-500/25 via-cyan-500/15 to-emerald-500/15 blur-3xl sm:h-96 sm:w-96 md:h-[28rem] md:w-[28rem]"
          aria-hidden
          animate={reducedMotion ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06] bg-gradient-to-b from-blue-400/15 to-cyan-400/10 sm:h-80 sm:w-80 md:h-[22rem] md:w-[22rem]"
          aria-hidden
          animate={reducedMotion ? undefined : { scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 flex w-full flex-col gap-3">
          {cards.map((service, slotIndex) => (
            <AnimatePresence mode="wait" key={slotIndex}>
              {service && (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={serviceIndex(slotIndex)}
                />
              )}
            </AnimatePresence>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

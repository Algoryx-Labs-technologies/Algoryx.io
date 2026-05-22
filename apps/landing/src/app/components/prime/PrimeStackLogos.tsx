import React from 'react';
import StackIcon, { type IconName } from 'tech-stack-icons';
import { PRIME_MARQUEE_ICONS } from '../../../data/primeStackIcons';

function StackLogo({ name }: { name: IconName }) {
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 p-2 opacity-80 transition-all duration-300 hover:opacity-100 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] sm:h-12 sm:w-12"
      title={name}
    >
      <StackIcon name={name} variant="dark" className="h-full w-full" />
    </div>
  );
}

type PrimeStackLogosProps = {
  /** Compact row inside flip card back */
  icons?: IconName[];
  compact?: boolean;
};

export function PrimeStackLogoRow({ icons, compact = false }: PrimeStackLogosProps) {
  if (!icons?.length) return null;

  return (
    <div
      className={
        compact
          ? 'flex flex-wrap items-center justify-center gap-2'
          : 'flex flex-wrap items-center gap-3 md:gap-4'
      }
    >
      {icons.map((name) => (
        <div
          key={name}
          className={
            compact
              ? 'flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-950/70 p-1'
              : 'flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 p-1.5 opacity-85 hover:opacity-100 transition-opacity'
          }
          title={name}
        >
          <StackIcon name={name} variant="dark" className="h-full w-full" />
        </div>
      ))}
    </div>
  );
}

export function PrimeStackMarquee() {
  const items = [...PRIME_MARQUEE_ICONS, ...PRIME_MARQUEE_ICONS];

  return (
    <div className="relative">
      <p className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-5">
        Trading infrastructure we build on
      </p>
      <div className="absolute inset-y-0 left-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />
      <div className="overflow-hidden py-2">
        <div className="prime-stack-marquee flex w-max items-center gap-8 md:gap-10 px-4">
          {items.map((name, index) => (
            <StackLogo key={`${name}-${index}`} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
}

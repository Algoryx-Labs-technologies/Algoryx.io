import { cn } from '../../../lib/utils';

const ACCENT_ORBS = [
  { primary: 'bg-blue-500/12', secondary: 'bg-indigo-500/8' },
  { primary: 'bg-cyan-500/12', secondary: 'bg-sky-500/8' },
  { primary: 'bg-violet-500/10', secondary: 'bg-blue-500/8' },
  { primary: 'bg-teal-500/10', secondary: 'bg-cyan-500/8' },
] as const;

type PrimeCardBackgroundProps = {
  index?: number;
  variant?: 'front' | 'back' | 'inline';
  className?: string;
};

export function PrimeCardBackground({
  index = 0,
  variant = 'front',
  className,
}: PrimeCardBackgroundProps) {
  const accent = ACCENT_ORBS[index % ACCENT_ORBS.length];

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#0c1220] to-[#060a12]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/[0.03]" />

      <div
        className={cn(
          'absolute -right-10 -top-14 h-36 w-36 rounded-full blur-3xl',
          accent.primary
        )}
      />
      <div
        className={cn(
          'absolute -bottom-16 -left-10 h-32 w-32 rounded-full blur-3xl',
          accent.secondary
        )}
      />

      {variant === 'back' && (
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/25 via-transparent to-blue-950/20" />
      )}

      {variant === 'inline' && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.01]" />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_100%_80%_at_50%_0%,#000_50%,transparent_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.45)_100%)]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  );
}

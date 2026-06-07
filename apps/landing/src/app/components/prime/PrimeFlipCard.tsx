import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import type { PrimeService } from '../../../data/primeServices';
import { getPrimeStackIcons } from '../../../data/primeStackIcons';
import { PrimeStackLogoRow } from './PrimeStackLogos';
import { PrimeCardBackground } from './PrimeCardBackground';
import { Button } from '../ui/button';
import { cn } from '../../../lib/utils';

type PrimeFlipCardProps = {
  service: PrimeService;
  index: number;
};

const faceBase =
  'prime-flip-face absolute inset-0 flex flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.09] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-[border-color,box-shadow] duration-500 group-hover/card:border-white/[0.16] group-hover/card:shadow-[0_24px_64px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]';

export function PrimeFlipCard({ service, index }: PrimeFlipCardProps) {
  const Icon = service.icon;
  const stackIcons = getPrimeStackIcons(service.id);
  const [touchFlipped, setTouchFlipped] = useState(false);

  const handleCardClick = useCallback(() => {
    if (window.matchMedia('(hover: none)').matches) {
      setTouchFlipped((f) => !f);
    }
  }, []);

  return (
    <div
      className="prime-flip group/card perspective-premium h-[min(340px,44vw)] min-h-[280px] w-full cursor-pointer sm:min-h-[300px]"
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${service.title}. ${touchFlipped ? 'Showing tech stack' : 'Tap to flip'}`}
    >
      <div className={cn('prime-flip-inner relative h-full w-full', touchFlipped && 'is-flipped-touch')}>
        {/* Front */}
        <div className={cn(faceBase, 'prime-flip-face-front z-10')}>
          <PrimeCardBackground index={index} variant="front" />

          <div className="relative flex flex-1 flex-col">
            <div className="mb-5 flex items-start justify-between gap-3">
              <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] font-semibold tabular-nums tracking-wider text-gray-400 backdrop-blur-sm">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-sm">
                <Icon className="h-5 w-5 text-cyan-300/90" />
              </div>
            </div>

            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-400/70 line-clamp-1">
              {service.tagline}
            </p>
            <h3 className="mb-3 text-[1.05rem] font-semibold leading-snug tracking-tight text-white line-clamp-2">
              {service.title}
            </h3>
            <p className="flex-1 text-[13px] leading-relaxed text-gray-400 line-clamp-4">{service.summary}</p>

            <div className="mt-5 flex items-center gap-2 border-t border-white/[0.08] pt-4 text-[10px] font-medium uppercase tracking-[0.16em] text-gray-500 transition-colors group-hover/card:text-gray-300">
              <Layers className="h-3 w-3 text-cyan-500/50" />
              <span className="hidden sm:inline">Hover to reveal stack</span>
              <span className="sm:hidden">Tap to flip</span>
              <ArrowRight className="ml-auto h-3 w-3 opacity-0 transition-all group-hover/card:translate-x-0.5 group-hover/card:opacity-60" />
            </div>
          </div>
        </div>

        {/* Back */}
        <div className={cn(faceBase, 'prime-flip-back items-center justify-center text-center')}>
          <PrimeCardBackground index={index} variant="back" />

          <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 px-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">Built with</p>
            <div className="rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md">
              <PrimeStackLogoRow icons={stackIcons} compact />
            </div>
            <Button
              asChild
              size="sm"
              className="h-9 rounded-full border border-white/15 bg-white/[0.08] px-5 text-white shadow-none backdrop-blur-sm hover:border-white/25 hover:bg-white/12"
              onClick={(e) => e.stopPropagation()}
            >
              <Link to={`/algoryx-prime/${service.id}`}>
                Explore
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import type { PrimeService } from '../../../data/primeServices';
import { getPrimeStackIcons } from '../../../data/primeStackIcons';
import { PrimeStackLogoRow } from './PrimeStackLogos';
import { MirrorShine } from './MirrorShine';
import { Button } from '../ui/button';
import { cn } from '../../../lib/utils';

type PrimeFlipCardProps = {
  service: PrimeService;
  index: number;
};

export function PrimeFlipCard({ service, index }: PrimeFlipCardProps) {
  const Icon = service.icon;
  const stackIcons = getPrimeStackIcons(service.id);
  const [touchFlipped, setTouchFlipped] = useState(false);

  const handleCardClick = useCallback(() => {
    if (window.matchMedia('(hover: none)').matches) {
      setTouchFlipped((f) => !f);
    }
  }, []);

  const faceClass =
    'prime-flip-face absolute inset-0 flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-800/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]';

  return (
    <div
      className="prime-flip perspective-premium h-[min(320px,42vw)] min-h-[260px] sm:min-h-[280px] w-full cursor-pointer"
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
      <div
        className={cn(
          'prime-flip-inner relative h-full w-full',
          touchFlipped && 'is-flipped-touch'
        )}
      >
        {/* Front */}
        <MirrorShine className={cn(faceClass, 'prime-flip-face-front z-10')}>
          <span className="text-[10px] font-bold tabular-nums text-cyan-500/60 mb-3">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="mb-3 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/25 border border-white/15 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Icon className="w-5 h-5 text-cyan-300" />
          </div>
          <p className="text-[10px] uppercase tracking-wider text-cyan-400/75 mb-1 line-clamp-1">{service.tagline}</p>
          <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-2">{service.title}</h3>
          <p className="text-xs text-gray-400 leading-relaxed flex-1 line-clamp-3">{service.summary}</p>
          <p className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider">
            <Layers className="w-3 h-3 text-cyan-500/70" />
            {/* <span className="hidden sm:inline">Hover to reveal stack</span> */}
            <span className="sm:hidden">Tap to flip</span>
          </p>
        </MirrorShine>

        {/* Back */}
        <MirrorShine
          auto
          className={cn(faceClass, 'prime-flip-back items-center justify-center text-center')}
        >
          <div className="relative z-10 flex flex-col items-center h-full justify-center gap-4 w-full">
            <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-400/80">Built with</p>
            <PrimeStackLogoRow icons={stackIcons} compact />
            <Button
              asChild
              size="sm"
              className="mt-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-cyan-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Link to={`/algoryx-prime/${service.id}`}>
                Explore
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </MirrorShine>
      </div>
    </div>
  );
}

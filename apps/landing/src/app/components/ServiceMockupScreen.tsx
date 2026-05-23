import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Service } from '../../data/services';

type ServiceMockupScreenProps = {
  service: Service;
  compact?: boolean;
};

export function ServiceMockupScreen({ service, compact = false }: ServiceMockupScreenProps) {
  const Icon = service.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className={`h-full bg-gradient-to-br from-slate-900 via-slate-800 to-black flex flex-col ${
          compact ? 'px-4 py-4' : 'px-4 pb-6 pt-4'
        }`}
      >
        <div className={`flex items-center gap-2 ${compact ? 'mb-3' : 'mb-4'}`}>
          <div
            className={`rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0 ${
              compact ? 'w-8 h-8' : 'w-9 h-9'
            }`}
          >
            <Icon className={compact ? 'w-3.5 h-3.5 text-cyan-400' : 'w-4 h-4 text-cyan-400'} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-cyan-400/80 truncate">Algoryx Labs</p>
            <p className={`text-white font-semibold truncate ${compact ? 'text-[11px]' : 'text-xs'}`}>
              {service.tagline}
            </p>
          </div>
        </div>

        <div className={`rounded-2xl border border-white/10 bg-slate-800/40 ${compact ? 'p-2.5 mb-2' : 'p-3 mb-3'}`}>
          <p className={`font-semibold text-white leading-snug line-clamp-2 ${compact ? 'text-xs' : 'text-sm'}`}>
            {service.title}
          </p>
          <p
            className={`text-gray-400 mt-2 leading-relaxed ${
              compact ? 'text-[10px] line-clamp-3' : 'text-[11px] line-clamp-4'
            }`}
          >
            {service.shortDescription}
          </p>
        </div>

        <div className={`space-y-2 flex-1 min-h-0 overflow-hidden ${compact ? 'gap-1.5' : ''}`}>
          {service.highlights.slice(0, compact ? 2 : 3).map((item) => (
            <div
              key={item}
              className={`flex items-start gap-2 rounded-xl bg-slate-900/60 border border-white/5 ${
                compact ? 'px-2 py-1.5' : 'px-2.5 py-2'
              }`}
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <p className={`text-gray-300 leading-snug line-clamp-2 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
                {item}
              </p>
            </div>
          ))}
        </div>

        <div className={`mt-auto ${compact ? 'pt-2' : 'pt-3'}`}>
          <div
            className={`rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-center ${
              compact ? 'px-3 py-2' : 'px-4 py-2.5'
            }`}
          >
            <span className={`font-semibold text-white ${compact ? 'text-[10px]' : 'text-xs'}`}>
              Explore service
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

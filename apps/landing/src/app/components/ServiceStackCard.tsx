import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StackIcon from 'tech-stack-icons';
import type { Service } from '../../data/services';

type ServiceStackCardProps = {
  service: Service;
};

export function ServiceStackCard({ service }: ServiceStackCardProps) {
  const Icon = service.icon;
  const colCount = service.stackIcons.length > 8 ? 5 : 4;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full"
      >
        <div className="relative w-full rounded-2xl md:rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-sm p-6 md:p-8 shadow-[0_0_40px_rgba(59,130,246,0.12)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 pointer-events-none" />

          <div className="relative flex items-center gap-3 mb-6">
            <div className="w-11 h-11 shrink-0 bg-gradient-to-br from-blue-500/25 to-cyan-500/20 rounded-xl flex items-center justify-center border border-white/10">
              <Icon className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-[10px] uppercase tracking-wider text-cyan-400/80 truncate">{service.tagline}</p>
              <p className="text-sm font-semibold text-white truncate">{service.title}</p>
            </div>
          </div>

          <p className="relative text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4 text-left">
            Tech stack & platforms
          </p>

          <div
            className="relative grid gap-2.5 md:gap-3"
            style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
          >
            {service.stackIcons.map((name) => (
              <div
                key={name}
                className="flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-slate-950/50 p-2 opacity-80 transition-opacity duration-300 hover:opacity-100"
                title={name}
              >
                <StackIcon name={name} variant="dark" className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

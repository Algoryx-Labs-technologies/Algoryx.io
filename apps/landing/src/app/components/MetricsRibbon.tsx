import React from 'react';

export type Metric = {
  value: string;
  label: string;
};

function MetricCell({ value, label }: Metric) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-4 text-center min-w-[9.5rem] shrink-0">
      <span className="text-2xl sm:text-3xl font-bold tabular-nums bg-gradient-to-b from-white via-blue-50 to-cyan-200/80 bg-clip-text text-transparent">
        {value}
      </span>
      <span
        className="mt-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </span>
    </div>
  );
}

type MetricsRibbonProps = {
  metrics: readonly Metric[];
  className?: string;
};

export function MetricsRibbon({ metrics, className = '' }: MetricsRibbonProps) {
  const marqueeItems = [...metrics, ...metrics];

  return (
    <div className={`w-full pt-2 ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Desktop / tablet: static ribbon */}
      <div className="hidden md:block relative mx-auto max-w-5xl">
        <div
          className="relative overflow-hidden border border-white/10 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 shadow-[0_8px_32px_rgba(59,130,246,0.12)] backdrop-blur-md"
          style={{
            clipPath:
              'polygon(14px 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0% 50%)',
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />

          <div
            className="grid divide-x divide-white/10"
            style={{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }}
          >
            {metrics.map((metric) => (
              <MetricCell key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: scrolling ribbon marquee */}
      <div className="md:hidden relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />

        <div className="border-y border-cyan-500/25 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 py-1 shadow-[0_4px_24px_rgba(59,130,246,0.1)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div className="hero-metrics-marquee flex w-max">
            {marqueeItems.map((metric, index) => (
              <div
                key={`${metric.label}-${index}`}
                className="flex items-center shrink-0 border-r border-white/10"
              >
                <MetricCell value={metric.value} label={metric.label} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

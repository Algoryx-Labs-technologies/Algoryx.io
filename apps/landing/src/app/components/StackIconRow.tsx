import React from 'react';
import StackIcon, { type IconName } from 'tech-stack-icons';

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9 sm:h-10 sm:w-10',
  lg: 'h-10 w-10 sm:h-11 sm:w-11',
} as const;

export function StackIconRow({
  icons,
  size = 'md',
  label = 'Technologies & tools',
}: {
  icons: IconName[];
  size?: keyof typeof sizeClasses;
  label?: string;
}) {
  if (icons.length === 0) return null;

  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">{label}</p>
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        {icons.map((name) => (
          <div
            key={name}
            className={`${sizeClasses[size]} flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/50 p-1.5 opacity-75 transition-opacity duration-300 hover:opacity-100`}
            title={name}
          >
            <StackIcon name={name} variant="dark" className="h-full w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

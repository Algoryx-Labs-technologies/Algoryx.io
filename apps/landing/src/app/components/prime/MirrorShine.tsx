import React from 'react';
import { cn } from '@/lib/utils';

type MirrorShineProps = {
  children: React.ReactNode;
  className?: string;
  /** Subtle looping shine (hero panels) */
  auto?: boolean;
};

export function MirrorShine({ children, className, auto = false }: MirrorShineProps) {
  return (
    <div className={cn('prime-shine-group relative overflow-hidden', className)}>
      <div
        className={cn('prime-shine-sweep z-20', auto && 'prime-shine-sweep-auto')}
        aria-hidden
      />
      {children}
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

type BrandLogoProps = {
  /** Header uses a taller mark; footer stays slightly smaller for the grid. */
  variant?: 'header' | 'footer';
  className?: string;
};

export function BrandLogo({ variant = 'header', className = '' }: BrandLogoProps) {
  const sizeClass =
    variant === 'header'
      ? 'h-16 w-auto min-h-[4rem] sm:h-[4.5rem] sm:min-h-[4.5rem] md:h-20 md:min-h-[5rem] lg:h-[5.25rem] lg:min-h-[5.25rem]'
      : 'h-14 w-auto min-h-[3.5rem] sm:h-16 sm:min-h-16 md:h-[4.25rem] md:min-h-[4.25rem]';

  return (
    <Link
      to="/"
      className={`inline-flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-md ${className}`}
    >
      <img
        src="/algoryx-labs-logo.png"
        alt="Algoryx Labs and Tech"
        width={608}
        height={253}
        decoding="async"
        className={`${sizeClass} max-w-[min(100%,18rem)] sm:max-w-[min(100%,22rem)] md:max-w-[min(100%,28rem)] object-contain object-left`}
      />
    </Link>
  );
}

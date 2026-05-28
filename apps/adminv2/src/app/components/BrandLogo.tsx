import { Link } from 'react-router-dom';
import { cn } from './ui/utils';

type BrandLogoProps = {
  collapsed?: boolean;
  className?: string;
};

export function BrandLogo({ collapsed = false, className = '' }: BrandLogoProps) {
  if (collapsed) {
    return (
      <Link
        to="/dashboard"
        className={cn(
          'inline-flex items-center justify-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-md',
          className,
        )}
        aria-label="Algoryx — dashboard"
      >
        <img
          src="/algoryx-mark.png"
          alt=""
          width={40}
          height={40}
          decoding="async"
          className="h-9 w-9 object-contain"
        />
      </Link>
    );
  }

  return (
    <Link
      to="/dashboard"
      className={cn(
        'inline-flex items-center shrink-0 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-md',
        className,
      )}
      aria-label="Algoryx Labs — dashboard"
    >
      <img
        src="/algoryx-labs-logo.png"
        alt="Algoryx Labs"
        width={608}
        height={253}
        decoding="async"
        className="h-10 w-auto max-w-[11rem] object-contain object-left sm:h-11 sm:max-w-[12rem]"
      />
    </Link>
  );
}

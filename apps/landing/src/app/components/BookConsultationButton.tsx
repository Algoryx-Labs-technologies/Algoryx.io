import { ArrowRight } from 'lucide-react';
import type { ComponentProps } from 'react';
import { getCalButtonProps } from '../../lib/cal';
import { Button } from './ui/button';
import { cn } from './ui/utils';

export const BOOK_CONSULTATION_BUTTON_CLASS =
  'rounded-full border-0 bg-white text-black hover:bg-gray-100 font-medium shadow-none';

type BookConsultationButtonProps = Omit<ComponentProps<typeof Button>, 'variant'> & {
  showArrow?: boolean;
};

export function BookConsultationButton({
  className,
  size = 'lg',
  showArrow = true,
  children = 'Book Free Consultation',
  ...props
}: BookConsultationButtonProps) {
  return (
    <Button
      size={size}
      className={cn(BOOK_CONSULTATION_BUTTON_CLASS, 'h-11 px-7', className)}
      {...getCalButtonProps()}
      {...props}
    >
      {children}
      {showArrow && <ArrowRight className="ml-2 h-5 w-5 shrink-0" />}
    </Button>
  );
}

import { ExternalLink } from 'lucide-react';
import { CAL_BOOKING_URL, CAL_CONSULTATION_DURATION } from '@/lib/cal';
import { BookConsultationButton } from '../BookConsultationButton';

export function ConsultationCta() {
  return (
    <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
      <BookConsultationButton className="h-10 w-full text-sm">
        Book free {CAL_CONSULTATION_DURATION} consultation
      </BookConsultationButton>
      <a
        href={CAL_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 text-[11px] text-cyan-400/90 transition-colors hover:text-cyan-300"
      >
        <ExternalLink className="h-3 w-3" />
        {CAL_BOOKING_URL.replace(/^https?:\/\//, '')}
      </a>
    </div>
  );
}

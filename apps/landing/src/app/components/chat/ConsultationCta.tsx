import React from 'react';
import { CalendarCheck, ExternalLink } from 'lucide-react';
import { CAL_BOOKING_URL, getCalButtonProps } from '@/lib/cal';

export function ConsultationCta() {
  return (
    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-cyan-500 hover:to-blue-500 transition-all"
        {...getCalButtonProps()}
      >
        <CalendarCheck className="h-4 w-4 shrink-0" />
        Book free 15-min consultation
      </button>
      <a
        href={CAL_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 text-[11px] text-cyan-400/90 hover:text-cyan-300 transition-colors"
      >
        <ExternalLink className="h-3 w-3" />
        {CAL_BOOKING_URL.replace(/^https?:\/\//, '')}
      </a>
    </div>
  );
}

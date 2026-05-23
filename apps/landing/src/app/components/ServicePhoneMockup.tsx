import React from 'react';
import type { Service } from '../../data/services';
import { ServiceMockupScreen } from './ServiceMockupScreen';

type ServicePhoneMockupProps = {
  service: Service;
};

export function ServicePhoneMockup({ service }: ServicePhoneMockupProps) {
  return (
    <div className="relative w-[260px] h-[520px] sm:w-[280px] sm:h-[560px] md:w-[300px] md:h-[600px] mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-[2.5rem] p-[1px] shadow-[0_0_40px_rgba(0,0,0,0.8),0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="w-full h-full bg-black rounded-[2.4rem] overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-28 h-4 md:h-5 bg-black rounded-b-xl z-20" />

          <div className="absolute top-1.5 left-0 right-0 flex justify-between items-center px-5 z-10">
            <span className="text-white text-[10px] md:text-xs font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-white/90 rounded-sm">
                <div className="w-3/4 h-full bg-white rounded-sm" />
              </div>
            </div>
          </div>

          <div className="pt-10 h-full">
            <ServiceMockupScreen service={service} />
          </div>
        </div>
      </div>
    </div>
  );
}

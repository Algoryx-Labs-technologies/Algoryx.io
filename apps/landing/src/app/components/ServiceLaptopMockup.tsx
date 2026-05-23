import React from 'react';
import type { Service } from '../../data/services';
import { ServiceMockupScreen } from './ServiceMockupScreen';

type ServiceLaptopMockupProps = {
  service: Service;
};

export function ServiceLaptopMockup({ service }: ServiceLaptopMockupProps) {
  return (
    <div className="relative w-full max-w-[520px] md:max-w-[580px] mx-auto">
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-xl md:rounded-t-2xl border-[3px] md:border-4 border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.5),0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="bg-black rounded-t-lg p-2 md:p-2.5">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500" />
          </div>
          <div className="relative bg-gradient-to-br from-slate-900 to-black rounded-lg overflow-hidden h-[280px] sm:h-[300px] md:h-[320px]">
            <ServiceMockupScreen service={service} compact />
          </div>
        </div>
      </div>
      <div className="relative mx-auto h-3 md:h-4 w-[92%] bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-lg border-x-2 border-b-2 border-slate-700" />
      <div className="relative mx-auto h-1.5 w-[70%] bg-slate-800 rounded-b-md shadow-lg" />
    </div>
  );
}

import React from 'react';
import StackIcon, { type IconName } from 'tech-stack-icons';
import { SERVICE_MARQUEE_ICONS } from '../../data/serviceStackIcons';

function StackLogo({ name }: { name: IconName }) {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center opacity-70 transition-opacity duration-300 hover:opacity-100 sm:h-11 sm:w-11 md:h-12 md:w-12"
      title={name}
    >
      <StackIcon name={name} variant="dark" className="h-full w-full" />
    </div>
  );
}

type ServiceStackLogosProps = {
  compact?: boolean;
};

export function ServiceStackLogos({ compact = false }: ServiceStackLogosProps) {
  const marqueeIcons = [...SERVICE_MARQUEE_ICONS, ...SERVICE_MARQUEE_ICONS];

  return (
    <div className={compact ? 'relative mb-0' : 'relative mb-10 md:mb-12'}>
      <div className="absolute inset-y-0 left-0 z-10 w-10 sm:w-16 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-10 sm:w-16 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />

      <div className="overflow-hidden py-1">
        <div className="services-stack-marquee flex w-max items-center gap-10 md:gap-12 px-4">
          {marqueeIcons.map((name, index) => (
            <StackLogo key={`${name}-${index}`} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
}

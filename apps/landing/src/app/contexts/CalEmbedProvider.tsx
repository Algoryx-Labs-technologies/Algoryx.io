import React, { useEffect } from 'react';
import { initCalEmbed } from '../../lib/initCalEmbed';

export function CalEmbedProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initCalEmbed().catch((error) => {
      console.error('Failed to load Cal.com embed', error);
    });
  }, []);

  return <>{children}</>;
}

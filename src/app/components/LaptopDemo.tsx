import React from 'react';
import { MacbookScroll } from './ui/macbook-scroll';

export function LaptopDemo() {
  return (
    <section className="relative w-full flex justify-center items-center py-24">
      <div className="relative w-full max-w-5xl">
        <MacbookScroll
          title={null}
          src={undefined}
          showGradient={false}
        />
      </div>
    </section>
  );
}


import React from 'react';

type AboutEditorialBlockProps = {
  children: React.ReactNode;
  className?: string;
};

export function AboutEditorialBlock({ children, className = '' }: AboutEditorialBlockProps) {
  return (
    <div
      className={`border-l border-white/20 pl-6 md:pl-8 text-gray-400 leading-relaxed text-base md:text-lg ${className}`}
    >
      {children}
    </div>
  );
}

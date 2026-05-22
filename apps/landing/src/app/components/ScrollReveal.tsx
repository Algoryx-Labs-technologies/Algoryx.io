import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScrollReveal({ 
  children, 
  delay = 0, 
  duration = 0.6,
  className = '' 
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const revealIfVisible = () => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight - 80 && rect.bottom > 80;
      if (inView) setIsInView(true);
    };

    revealIfVisible();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '-40px 0px',
      }
    );

    observer.observe(el);

    const onHashScroll = () => requestAnimationFrame(revealIfVisible);
    window.addEventListener('hashchange', onHashScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', onHashScroll);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.1, 0.25, 1] // Custom easing for smooth animation
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


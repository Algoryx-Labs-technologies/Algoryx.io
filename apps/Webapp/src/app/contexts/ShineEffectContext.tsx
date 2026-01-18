import React, { createContext, useContext, useEffect, useState } from 'react';

interface ShineEffectContextType {
  shouldShine: boolean;
}

const ShineEffectContext = createContext<ShineEffectContextType | undefined>(undefined);

export function ShineEffectProvider({ children }: { children: React.ReactNode }) {
  const [shouldShine, setShouldShine] = useState(false);
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const minute = now.getMinutes();
      
      // Check if minute has changed
      if (minute !== currentMinute) {
        setCurrentMinute(minute);
        setShouldShine(true);
        
        // Reset after animation completes (1.5 seconds)
        setTimeout(() => {
          setShouldShine(false);
        }, 1500);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentMinute]);

  return (
    <ShineEffectContext.Provider value={{ shouldShine }}>
      {children}
    </ShineEffectContext.Provider>
  );
}

export function useShineEffect() {
  const context = useContext(ShineEffectContext);
  if (context === undefined) {
    throw new Error('useShineEffect must be used within a ShineEffectProvider');
  }
  return context;
}


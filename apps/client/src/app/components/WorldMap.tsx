import React, { useEffect, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';

const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface WorldMapProps {
  className?: string;
}

export function WorldMap({ className = '' }: WorldMapProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative ${className}`}>
      <ComposableMap
        projectionConfig={{
          scale: 120,
          center: [0, 20],
        }}
        className="w-full h-full"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          {/* Light mode gradient - matches blue-400/10 and cyan-400/5 theme */}
          <linearGradient id="mapGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(96, 165, 250, 0.15)" />
            <stop offset="50%" stopColor="rgba(34, 211, 238, 0.2)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.15)" />
          </linearGradient>
          {/* Dark mode gradient - matches blue-600/20 and cyan-500/10 theme */}
          <linearGradient id="mapGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(37, 99, 235, 0.25)" />
            <stop offset="50%" stopColor="rgba(6, 182, 212, 0.3)" />
            <stop offset="100%" stopColor="rgba(37, 99, 235, 0.25)" />
          </linearGradient>
        </defs>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={isDark ? 'url(#mapGradientDark)' : 'url(#mapGradientLight)'}
                stroke={isDark ? 'rgba(37, 99, 235, 0.4)' : 'rgba(59, 130, 246, 0.3)'}
                strokeWidth={0.5}
                style={{
                  default: {
                    outline: 'none',
                  },
                  hover: {
                    fill: isDark ? 'rgba(37, 99, 235, 0.5)' : 'rgba(59, 130, 246, 0.4)',
                    outline: 'none',
                    transition: 'all 0.3s',
                  },
                  pressed: {
                    fill: isDark ? 'rgba(37, 99, 235, 0.6)' : 'rgba(59, 130, 246, 0.5)',
                    outline: 'none',
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}


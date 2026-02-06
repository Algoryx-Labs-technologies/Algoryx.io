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

  // Function to check if a country should be highlighted
  const isHighlightedRegion = (geo: any): boolean => {
    if (!geo.properties) return false;
    
    const props = geo.properties;
    const name = (props.NAME || props.NAME_LONG || props.name || props.NAME_EN || '').toLowerCase();
    const isoA3 = (props.ISO_A3 || props.iso_a3 || '').toUpperCase();
    const isoA2 = (props.ISO_A2 || props.iso_a2 || '').toUpperCase();
    
    // US
    if (isoA3 === 'USA' || isoA2 === 'US' || name.includes('united states')) {
      return true;
    }
    
    // India
    if (isoA3 === 'IND' || isoA2 === 'IN' || name.includes('india')) {
      return true;
    }
    
    // Europe - Major countries
    const europeanCountries = [
      'united kingdom', 'france', 'germany', 'italy', 'spain', 'netherlands',
      'belgium', 'switzerland', 'austria', 'sweden', 'norway', 'denmark',
      'finland', 'poland', 'portugal', 'greece', 'ireland', 'czech',
      'romania', 'hungary', 'bulgaria', 'croatia', 'slovakia', 'slovenia',
      'lithuania', 'latvia', 'estonia', 'luxembourg', 'malta', 'cyprus'
    ];
    if (europeanCountries.some(country => name.includes(country))) {
      return true;
    }
    
    // Middle East
    const middleEastCountries = [
      'united arab emirates', 'uae', 'saudi arabia', 'israel', 'qatar', 'kuwait',
      'bahrain', 'oman', 'jordan', 'lebanon', 'iraq', 'iran', 'turkey',
      'egypt', 'yemen', 'syria'
    ];
    if (middleEastCountries.some(country => name.includes(country))) {
      return true;
    }
    
    return false;
  };

  // Get fill color based on region
  const getFillColor = (geo: any): string => {
    if (isHighlightedRegion(geo)) {
      // Blue color for highlighted regions
      return isDark ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.5)';
    }
    // Default gradient for other regions
    return isDark ? 'url(#mapGradientDark)' : 'url(#mapGradientLight)';
  };

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
            geographies.map((geo) => {
              const isHighlighted = isHighlightedRegion(geo);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getFillColor(geo)}
                  stroke={isHighlighted 
                    ? (isDark ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.7)')
                    : (isDark ? 'rgba(37, 99, 235, 0.4)' : 'rgba(59, 130, 246, 0.3)')
                  }
                  strokeWidth={isHighlighted ? 0.8 : 0.5}
                  style={{
                    default: {
                      outline: 'none',
                    },
                    hover: {
                      fill: isHighlighted
                        ? (isDark ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.7)')
                        : (isDark ? 'rgba(37, 99, 235, 0.5)' : 'rgba(59, 130, 246, 0.4)'),
                      outline: 'none',
                      transition: 'all 0.3s',
                    },
                    pressed: {
                      fill: isHighlighted
                        ? (isDark ? 'rgba(59, 130, 246, 0.9)' : 'rgba(59, 130, 246, 0.8)')
                        : (isDark ? 'rgba(37, 99, 235, 0.6)' : 'rgba(59, 130, 246, 0.5)'),
                      outline: 'none',
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}


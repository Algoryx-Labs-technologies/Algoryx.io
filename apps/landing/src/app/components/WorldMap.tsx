import React, { useEffect, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Key locations for blue markers: [longitude, latitude]
const markers = [
  { coordinates: [-95.7129, 37.0902], name: 'United States' }, // US Center
  { coordinates: [77.2090, 28.6139], name: 'India' }, // New Delhi, India
  { coordinates: [2.3522, 48.8566], name: 'Europe' }, // Paris, France (Europe representative)
  { coordinates: [54.3773, 24.4539], name: 'Middle East' }, // Dubai, UAE (Middle East representative)
];

interface WorldMapProps {
  className?: string;
}

export function WorldMap({ className = '' }: WorldMapProps) {
  const [isDark, setIsDark] = useState(false);
  const [activeMarker, setActiveMarker] = useState(0);

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

  // Auto-navigate through markers
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMarker((prev) => (prev + 1) % markers.length);
    }, 3000); // Change marker every 3 seconds

    return () => clearInterval(interval);
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
        
        {/* Blue markers for key regions */}
        {markers.map((marker, index) => {
          const isActive = activeMarker === index;
          return (
            <Marker key={index} coordinates={marker.coordinates}>
              <g>
                {/* Outer glow layer 1 - largest */}
                <circle
                  r={isActive ? 16 : 10}
                  fill="rgba(59, 130, 246, 0.2)"
                  style={{
                    filter: isActive 
                      ? 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))'
                      : 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isActive && (
                    <>
                      <animate
                        attributeName="r"
                        values="10;16;10"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.2;0.4;0.2"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </>
                  )}
                </circle>
                
                {/* Outer glow layer 2 - medium */}
                <circle
                  r={isActive ? 12 : 8}
                  fill="rgba(59, 130, 246, 0.35)"
                  style={{
                    filter: isActive 
                      ? 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.9)) drop-shadow(0 0 25px rgba(59, 130, 246, 0.6))'
                      : 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isActive && (
                    <>
                      <animate
                        attributeName="r"
                        values="8;12;8"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.35;0.5;0.35"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </>
                  )}
                </circle>
                
                {/* Inner solid circle with strong glow */}
                <circle
                  r={isActive ? 7 : 5}
                  fill="rgba(59, 130, 246, 1)"
                  stroke="rgba(96, 165, 250, 1)"
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{
                    filter: isActive
                      ? 'drop-shadow(0 0 12px rgba(59, 130, 246, 1)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))'
                      : 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.7)) drop-shadow(0 0 12px rgba(59, 130, 246, 0.4))',
                    transition: 'all 0.3s ease',
                  }}
                />
                
                {/* Center bright dot */}
                <circle
                  r={isActive ? 3 : 2}
                  fill="white"
                  style={{
                    filter: isActive
                      ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))'
                      : 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))',
                    transition: 'all 0.3s ease',
                  }}
                />
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
      
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}

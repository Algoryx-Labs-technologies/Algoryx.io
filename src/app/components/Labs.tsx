import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { FlaskConical, ArrowRight, Lock } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

// Code snippets with similar line counts and character counts
const CODE_SNIPPETS = [
  {
    filename: 'strategy.py',
    code: `def generate_signals(data):
    # Calculate Moving Averages
    data['SMA_50'] = data['Close'].rolling(window=50).mean()
    data['SMA_200'] = data['Close'].rolling(window=200).mean()
    
    # Generate Entry Signal
    if data['SMA_50'] > data['SMA_200']:
        return "BUY"
    return "HOLD"`
  },
  {
    filename: 'risk_model.py',
    code: `def calculate_risk(portfolio):
    # Compute Value at Risk
    returns = portfolio.pct_change()
    var_95 = returns.quantile(0.05)
    
    # Risk Metrics
    volatility = returns.std() * np.sqrt(252)
    sharpe = returns.mean() / volatility
    return {"VaR": var_95, "Sharpe": sharpe}`
  },
  {
    filename: 'backtest.py',
    code: `def run_backtest(strategy, data):
    # Initialize portfolio
    capital = 100000
    positions = []
    
    # Execute strategy
    for signal in strategy.generate(data):
        if signal == "BUY":
            positions.append(execute_trade())
    return calculate_returns(positions)`
  },
  {
    filename: 'ml_model.py',
    code: `def train_predictor(features, target):
    # Split data for training
    X_train, X_test = train_test_split(features)
    y_train, y_test = train_test_split(target)
    
    # Train model
    model = RandomForestRegressor()
    model.fit(X_train, y_train)
    return model.predict(X_test)`
  }
];

function CodeScanner() {
  const [scanPosition, setScanPosition] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [animationPhase, setAnimationPhase] = useState<'scanning' | 'backspacing' | 'typing' | 'idle'>('idle');
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef<'scanning' | 'backspacing' | 'typing' | 'idle'>('idle');
  const codeIndexRef = useRef(0);
  const hasScannedOnceRef = useRef(false);

  const currentSnippet = CODE_SNIPPETS[currentCodeIndex];

  // Main animation cycle - runs once when hasScanned becomes true
  useEffect(() => {
    if (!hasScanned) return;

    let isMounted = true;
    codeIndexRef.current = 0;
    phaseRef.current = 'scanning';

    const cleanup = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const startScanning = () => {
      if (!isMounted) return;
      phaseRef.current = 'scanning';
      setAnimationPhase('scanning');
      setIsScanning(true);
      setScanPosition(0);

      const scanDuration = 2500;
      const startTime = Date.now();

      const animateScan = () => {
        if (!isMounted || phaseRef.current !== 'scanning') return;
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / scanDuration, 1);
        
        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        if (codeRef.current) {
          setScanPosition(easeInOutCubic * codeRef.current.offsetHeight);
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateScan);
        } else {
          setIsScanning(false);
          hasScannedOnceRef.current = true;
          timeoutRef.current = setTimeout(() => {
            if (isMounted) {
              startBackspacing();
            }
          }, 1000);
        }
      };

      animationRef.current = requestAnimationFrame(animateScan);
    };

    const startBackspacing = () => {
      if (!isMounted) return;
      phaseRef.current = 'backspacing';
      setAnimationPhase('backspacing');
      cleanup();
      
      const fullCode = CODE_SNIPPETS[codeIndexRef.current].code;
      let currentLength = fullCode.length;
      const backspaceSpeed = 30;

      intervalRef.current = setInterval(() => {
        if (!isMounted || phaseRef.current !== 'backspacing') {
          cleanup();
          return;
        }
        currentLength = Math.max(0, currentLength - 1);
        setDisplayedCode(fullCode.substring(0, currentLength));

        if (currentLength === 0) {
          cleanup();
          timeoutRef.current = setTimeout(() => {
            if (isMounted) {
              codeIndexRef.current = (codeIndexRef.current + 1) % CODE_SNIPPETS.length;
              setCurrentCodeIndex(codeIndexRef.current);
              startTyping();
            }
          }, 500);
        }
      }, backspaceSpeed);
    };

    const startTyping = () => {
      if (!isMounted) return;
      phaseRef.current = 'typing';
      setAnimationPhase('typing');
      cleanup();
      
      const fullCode = CODE_SNIPPETS[codeIndexRef.current].code;
      let currentLength = 0;
      const typeSpeed = 30;

      intervalRef.current = setInterval(() => {
        if (!isMounted || phaseRef.current !== 'typing') {
          cleanup();
          return;
        }
        currentLength = Math.min(fullCode.length, currentLength + 1);
        setDisplayedCode(fullCode.substring(0, currentLength));

        if (currentLength === fullCode.length) {
          cleanup();
          timeoutRef.current = setTimeout(() => {
            if (isMounted) {
              // After typing completes, go directly to backspacing (no more scanning)
              startBackspacing();
            }
          }, 1000);
        }
      }, typeSpeed);
    };

    // Initialize with first code
    setDisplayedCode(CODE_SNIPPETS[0].code);
    startScanning();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [hasScanned]);

  // Initial intersection observer
  useEffect(() => {
    if (hasScanned) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasScanned) {
          setTimeout(() => {
            if (codeRef.current) {
              setHasScanned(true);
            }
          }, 300);

          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      observer.disconnect();
    };
  }, [hasScanned]);

  // Render code with syntax highlighting
  const renderCode = () => {
    if (!displayedCode) return null;
    
    const lines = displayedCode.split('\n');
    return lines.map((line, lineIdx) => {
      const parts: Array<{ text: string; className: string }> = [];
      let currentText = '';
      let inString = false;
      let stringChar = '';
      let inComment = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const remaining = line.substring(i);
        
        // Check for comments
        if (!inString && char === '#') {
          if (currentText) {
            parts.push({ text: currentText, className: 'text-gray-300' });
            currentText = '';
          }
          parts.push({ text: remaining, className: 'text-gray-500' });
          break;
        }
        
        // Check for strings
        if (!inComment && (char === '"' || char === "'")) {
          if (currentText) {
            parts.push({ text: currentText, className: 'text-gray-300' });
            currentText = '';
          }
          if (!inString) {
            inString = true;
            stringChar = char;
            currentText = char;
          } else if (char === stringChar) {
            currentText += char;
            parts.push({ text: currentText, className: 'text-green-400' });
            currentText = '';
            inString = false;
          } else {
            currentText += char;
          }
          continue;
        }
        
        // Check for keywords (only when not in string)
        if (!inString && !inComment) {
          if (remaining.startsWith('def ')) {
            if (currentText) {
              parts.push({ text: currentText, className: 'text-gray-300' });
              currentText = '';
            }
            parts.push({ text: 'def', className: 'text-purple-400' });
            currentText = ' ';
            i += 3;
            continue;
          }
          if (remaining.startsWith('return ')) {
            if (currentText.trim()) {
              parts.push({ text: currentText, className: 'text-gray-300' });
              currentText = '';
            }
            parts.push({ text: 'return', className: 'text-purple-400' });
            currentText = ' ';
            i += 6;
            continue;
          }
          if (remaining.startsWith('if ')) {
            if (currentText.trim()) {
              parts.push({ text: currentText, className: 'text-gray-300' });
              currentText = '';
            }
            parts.push({ text: 'if', className: 'text-purple-400' });
            currentText = ' ';
            i += 2;
            continue;
          }
          
          // Check for numbers
          if (/\d/.test(char) && (i === 0 || !/\w/.test(line[i - 1]))) {
            if (currentText) {
              parts.push({ text: currentText, className: 'text-gray-300' });
              currentText = '';
            }
            let num = char;
            i++;
            while (i < line.length && /\d/.test(line[i])) {
              num += line[i];
              i++;
            }
            i--;
            parts.push({ text: num, className: 'text-yellow-400' });
            continue;
          }
        }
        
        currentText += char;
      }
      
      if (currentText) {
        parts.push({ text: currentText, className: inString ? 'text-green-400' : 'text-gray-300' });
      }
      
      return (
        <React.Fragment key={lineIdx}>
          {parts.map((part, partIdx) => (
            <span key={partIdx} className={part.className}>
              {part.text}
            </span>
          ))}
          {lineIdx < lines.length - 1 && '\n'}
        </React.Fragment>
      );
    });
  };

  return (
    <div ref={containerRef} className="w-full max-w-full sm:max-w-xl md:max-w-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl overflow-hidden shadow-2xl relative">
      {/* Code editor header */}
      <div className="flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 bg-slate-800/50 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 rounded-full bg-green-500/80"></div>
        </div>
        <span className="ml-2 text-xs sm:text-sm text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {currentSnippet.filename}
        </span>
      </div>
      
      {/* Code content with scanning effect */}
      <div className="relative overflow-hidden">
        {/* Initial overlay - covers code until scanning starts */}
        {!hasScanned && (
          <div className="absolute inset-0 bg-slate-900 pointer-events-none z-10" />
        )}
        
        {/* Scanning overlay - black mask that reveals code from top to bottom */}
        {isScanning && codeRef.current && animationPhase === 'scanning' && (
          <div 
            className="absolute inset-0 bg-slate-900 pointer-events-none z-10"
            style={{
              maskImage: `linear-gradient(to bottom, transparent 0%, transparent ${(scanPosition / codeRef.current.offsetHeight) * 100}%, black ${(scanPosition / codeRef.current.offsetHeight) * 100}%, black 100%)`,
              WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, transparent ${(scanPosition / codeRef.current.offsetHeight) * 100}%, black ${(scanPosition / codeRef.current.offsetHeight) * 100}%, black 100%)`,
            }}
          />
        )}
        
        {/* Scanning line with glow effect */}
        {isScanning && codeRef.current && scanPosition < codeRef.current.offsetHeight && animationPhase === 'scanning' && (
          <div
            className="absolute left-0 right-0 pointer-events-none z-20"
            style={{
              top: `${scanPosition}px`,
              transform: 'translateY(-50%)',
            }}
          >
            <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-sm -mt-0.5" />
          </div>
        )}

        {/* Code content */}
        <div 
          ref={codeRef}
          className="p-4 sm:p-6 md:p-8 text-xs sm:text-sm md:text-base overflow-x-auto relative z-0 min-h-[200px]" 
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <pre className="text-gray-300 leading-relaxed whitespace-pre">
            {renderCode()}
            {/* Cursor blink effect during typing/backspacing */}
            {(animationPhase === 'typing' || animationPhase === 'backspacing') && (
              <span className="inline-block w-2 h-4 bg-cyan-400 ml-0.5 animate-pulse" />
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function Labs() {
  return (
    <section id="labs" className="py-12 md:py-16 lg:py-24 relative font-labs">
      <div className="container mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="relative bg-gradient-to-br from-blue-600/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 overflow-hidden">
          {/* Coming Soon Ribbon */}
          <div className="absolute top-0 right-0 z-20">
            <div className="relative">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-bl-lg shadow-lg">
                Coming Soon
              </div>
              <div className="absolute top-full right-0 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-blue-600"></div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left content */}
            <div className="space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 text-xs md:text-sm">
                <FlaskConical className="w-3 h-3 md:w-4 md:h-4" />
                <span>Algoryx Labs</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Custom AI/ML & Quant
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Research Solutions
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
              Partner with our research team to develop bespoke trading algorithms, risk models, and quantitative strategies tailored to your specific needs.
              </p>

              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3 text-gray-300 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span>Custom strategy development & optimization</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-gray-300 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                  <span>Machine learning model deployment</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-gray-300 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <span>Backtesting & performance analysis</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-gray-300 text-sm sm:text-base">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                  <span>Risk management systems</span>
                </div>
              </div>

              <Button
                size="lg"
                disabled
                className="relative bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 text-sm sm:text-base px-6 sm:px-8 h-10 sm:h-12 w-full sm:w-auto opacity-50 cursor-not-allowed"
              >
                <Lock className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Visit Algoryx Labs
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            {/* Right side - Code display */}
            <div className="flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
              <CodeScanner />
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { BarChart3 } from 'lucide-react';
import { StockAnalyser } from './StockAnalyser';

interface Candlestick {
  open: number;
  high: number;
  low: number;
  close: number;
  isUp?: boolean;
}

type TradingDemoMobileProps = {
  hasEntered: boolean;
  pnlAmount: number;
  pnlPercent: number;
  pnlTrend: 'up' | 'down';
  candlestickData: Candlestick[];
  shineKey: number;
};

function PhoneFrame({
  children,
  className = '',
  screenHeight = 400,
}: {
  children: React.ReactNode;
  className?: string;
  screenHeight?: number;
}) {
  return (
    <div className={`relative w-[210px] sm:w-[220px] ${className}`}>
      <div className="rounded-[2rem] bg-gradient-to-b from-slate-700 to-slate-800 p-[3px] shadow-[0_20px_50px_rgba(0,0,0,0.45)] border border-slate-600/40">
        <div className="rounded-[1.85rem] bg-slate-900 p-[6px]">
          <div className="absolute left-1/2 top-[14px] z-20 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-black" />
          <div
            className="relative overflow-hidden rounded-[1.5rem] bg-black"
            style={{ height: screenHeight }}
          >
            {children}
          </div>
        </div>
      </div>
      <div className="absolute -right-[2px] top-[88px] h-10 w-[3px] rounded-r bg-slate-600/80" />
      <div className="absolute -left-[2px] top-[72px] h-6 w-[3px] rounded-l bg-slate-600/80" />
      <div className="absolute -left-[2px] top-[104px] h-10 w-[3px] rounded-l bg-slate-600/80" />
    </div>
  );
}

function MobileStatusBar({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 text-[10px] text-gray-400 border-b border-white/5 bg-slate-900/80">
      <span>9:41</span>
      <span className="font-medium text-cyan-400/90">{label}</span>
      <span>100%</span>
    </div>
  );
}

function MobilePnlScreen({
  pnlAmount,
  pnlPercent,
  pnlTrend,
  candlestickData,
}: Pick<TradingDemoMobileProps, 'pnlAmount' | 'pnlPercent' | 'pnlTrend' | 'candlestickData'>) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-slate-900 to-black">
      <MobileStatusBar label="Prime" />
      <div className="flex-1 overflow-hidden p-3 space-y-3">
        <div className="rounded-xl border border-white/5 bg-slate-800/40 p-3">
          <p className="text-[10px] text-gray-400 mb-0.5">Portfolio value</p>
          <p className="text-lg font-bold text-white">$130,067.40</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-[10px] text-gray-400">Past year returns</p>
              <p
                className="text-sm font-bold"
                style={{ color: pnlTrend === 'up' ? '#10b981' : '#ef4444' }}
              >
                +$
                {Math.floor(pnlAmount).toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
                .
                {Math.floor((pnlAmount % 1) * 100)
                  .toString()
                  .padStart(2, '0')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400">Return</p>
              <p
                className="text-sm font-bold"
                style={{ color: pnlTrend === 'up' ? '#10b981' : '#ef4444' }}
              >
                +{Math.floor(pnlPercent * 10) / 10}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/60 p-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium text-gray-300">Live chart</span>
            <span className="text-[9px] text-gray-500">1Y</span>
          </div>
          <div className="h-24 overflow-hidden rounded-lg border border-white/5 bg-slate-950/50">
            <svg className="h-full w-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              {[20, 40, 60, 80].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="300"
                  y2={y}
                  stroke="#374151"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}
              {candlestickData.map((candle, index) => {
                const x = (index / (candlestickData.length - 1)) * 300;
                const candleWidth = 7;
                const xPos = x - candleWidth / 2;
                const highY = 100 - candle.high;
                const lowY = 100 - candle.low;
                const openY = 100 - candle.open;
                const closeY = 100 - candle.close;
                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.abs(closeY - openY) || 1;

                return (
                  <g key={`mobile-${index}-${candlestickData.length}`}>
                    <line
                      x1={x}
                      y1={highY}
                      x2={x}
                      y2={lowY}
                      stroke={candle.isUp ? '#10b981' : '#ef4444'}
                      strokeWidth="1"
                    />
                    <rect
                      x={xPos}
                      y={bodyTop}
                      width={candleWidth}
                      height={bodyHeight}
                      fill={candle.isUp ? '#10b981' : '#ef4444'}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-800/30 p-2.5">
          <p className="mb-2 text-[10px] font-semibold text-white">Top movers</p>
          <div className="space-y-1.5">
            {[
              { sym: 'NVDA', ch: '+1.15%', up: true },
              { sym: 'AAPL', ch: '-0.82%', up: false },
              { sym: 'MSFT', ch: '+0.64%', up: true },
            ].map((row) => (
              <div key={row.sym} className="flex items-center justify-between text-[10px]">
                <span className="text-gray-300">{row.sym}</span>
                <span className={row.up ? 'text-green-400' : 'text-red-400'}>{row.ch}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Laptop analyser view scaled to fit the second phone (static — no tab cycling on mobile). */
function MobilePortfolioAnalysisScreen({ shineKey }: { shineKey: number }) {
  const scale = 0.265;

  return (
    <div className="flex h-full min-h-0 flex-col bg-black">
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-slate-800/95 px-3 py-2">
        <BarChart3 className="h-3.5 w-3.5 shrink-0 text-cyan-400/90" aria-hidden />
        <span className="text-[10px] font-medium text-gray-100">Portfolio analysis</span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden bg-slate-950">
        {shineKey > 0 && (
          <div
            key={`mobile-analyser-shine-${shineKey}`}
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
          >
            <div
              className="absolute h-full w-full"
              style={{
                background:
                  'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%, transparent 100%)',
                transform: 'translateX(-100%) translateY(-100%) skewX(-45deg)',
                animation: 'mirrorShine 2s ease-out',
                animationDelay: '0.4s',
                animationFillMode: 'forwards',
                width: '200%',
                height: '200%',
              }}
            />
          </div>
        )}
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: 900,
            height: 520,
            transform: `scale(${scale})`,
          }}
        >
          <StockAnalyser />
        </div>
      </div>
    </div>
  );
}

export function TradingDemoMobile({
  hasEntered,
  pnlAmount,
  pnlPercent,
  pnlTrend,
  candlestickData,
  shineKey,
}: TradingDemoMobileProps) {
  return (
    <div className="relative mx-auto max-w-sm px-2">
      <div className="relative flex min-h-[480px] items-start justify-center pt-2">
        <motion.div
          className="relative z-10 shrink-0"
          style={{ marginRight: '-36px' }}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={hasEntered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <PhoneFrame screenHeight={420}>
            <MobilePnlScreen
              pnlAmount={pnlAmount}
              pnlPercent={pnlPercent}
              pnlTrend={pnlTrend}
              candlestickData={candlestickData}
            />
          </PhoneFrame>
        </motion.div>

        <motion.div
          className="relative z-20 mt-20 shrink-0"
          initial={{ opacity: 0, y: 60, x: 40 }}
          animate={hasEntered ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 60, x: 40 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <PhoneFrame screenHeight={360} className="scale-[0.92] origin-top">
            <MobilePortfolioAnalysisScreen shineKey={shineKey} />
          </PhoneFrame>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none mt-6 text-center font-tagline"
        initial={{ opacity: 0, y: 20 }}
        animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <p className="mb-1 text-sm italic text-gray-400">AlgoRyx</p>
        <p className="text-xl font-bold italic text-white sm:text-2xl">Algorithms Over opinion.</p>
      </motion.div>
    </div>
  );
}

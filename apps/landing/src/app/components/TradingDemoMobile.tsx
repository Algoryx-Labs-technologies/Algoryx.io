import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

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

const TOP_STOCKS = [
  { symbol: 'MSFT', price: 378.92, change: 1.1 },
  { symbol: 'NVDA', price: 485.23, change: -1.15 },
  { symbol: 'AAPL', price: 169.23, change: -1.08 },
  { symbol: 'META', price: 312.45, change: 0.39 },
];

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
          <div className="absolute left-1/2 top-[14px] z-30 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-black" />
          <div
            className="relative overflow-hidden rounded-[1.5rem] bg-black pt-7"
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
    <div className="flex shrink-0 items-center justify-between px-3 pb-2 text-[9px] text-gray-400">
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
      <div className="flex-1 overflow-hidden px-2.5 pb-2.5 space-y-2.5">
        <div className="rounded-xl border border-white/5 bg-slate-800/40 p-2.5">
          <p className="text-[9px] text-gray-400 mb-0.5">Portfolio value</p>
          <p className="text-base font-bold text-white">$130,067.40</p>
          <div className="mt-1.5 flex items-end justify-between">
            <div>
              <p className="text-[9px] text-gray-400">Past year returns</p>
              <p
                className="text-xs font-bold"
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
              <p className="text-[9px] text-gray-400">Return</p>
              <p
                className="text-xs font-bold"
                style={{ color: pnlTrend === 'up' ? '#10b981' : '#ef4444' }}
              >
                +{Math.floor(pnlPercent * 10) / 10}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/60 p-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[9px] font-medium text-gray-300">Live chart</span>
            <span className="text-[8px] text-gray-500">1Y</span>
          </div>
          <div className="h-[72px] overflow-hidden rounded-lg border border-white/5 bg-slate-950/50">
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

        <div className="rounded-xl border border-white/5 bg-slate-800/30 p-2">
          <p className="mb-1.5 text-[9px] font-semibold text-white">Top movers</p>
          <div className="space-y-1">
            {[
              { sym: 'NVDA', ch: '+1.15%', up: true },
              { sym: 'AAPL', ch: '-0.82%', up: false },
              { sym: 'MSFT', ch: '+0.64%', up: true },
            ].map((row) => (
              <div key={row.sym} className="flex items-center justify-between text-[9px]">
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

function MobilePortfolioAnalysisScreen({ shineKey }: { shineKey: number }) {
  const [closingData, setClosingData] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      closing: 0.02 + Math.sin(i * 0.5) * 0.025,
      opening: 0.015 + Math.sin(i * 0.5) * 0.02,
      volume: 40 + Math.sin(i * 0.4) * 25,
    }))
  );
  const [volumeData, setVolumeData] = useState(() =>
    Array.from({ length: 12 }, (_, i) => 50 + Math.sin(i * 0.35) * 30)
  );
  const [stocks, setStocks] = useState(TOP_STOCKS);

  useEffect(() => {
    const interval = setInterval(() => {
      setClosingData((prev) =>
        prev.map((d, i) => {
          const base = 0.02 + Math.sin(i * 0.5) * 0.025;
          const offset = (Math.random() - 0.5) * 0.008;
          return {
            closing: base + offset,
            opening: base + offset - 0.004,
            volume: 40 + Math.sin(i * 0.4) * 25 + Math.random() * 10,
          };
        })
      );
      setVolumeData((prev) =>
        prev.map((v, i) => 50 + Math.sin(i * 0.35) * 30 + Math.random() * 15)
      );
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((s) => {
          const delta = (Math.random() - 0.5) * 0.4;
          const change = s.change + delta * 0.1;
          return { ...s, price: s.price + delta, change };
        })
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col bg-gradient-to-b from-slate-900 to-black">
      <MobileStatusBar label="Analysis" />

      <div className="relative flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-2.5 pb-2.5">
        {shineKey > 0 && (
          <div
            key={`mobile-analyser-shine-${shineKey}`}
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
          >
            <div
              className="absolute h-full w-full"
              style={{
                background:
                  'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%, transparent 100%)',
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

        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'High volume', value: '618.2M' },
            { label: 'Low volume', value: '0' },
            { label: 'All-time low', value: '1.5' },
            { label: 'All-time high', value: '2,068' },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-white/5 bg-slate-800/40 px-2 py-1.5"
            >
              <p className="text-[8px] text-gray-400">{m.label}</p>
              <p className="text-[10px] font-bold text-white">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-white/5 bg-slate-800/30 p-2">
          <p className="mb-1.5 text-[9px] font-semibold text-white">Top stocks</p>
          <div className="grid grid-cols-2 gap-1">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between gap-0.5 rounded bg-slate-900/50 px-1.5 py-1"
              >
                <span className="text-[8px] font-medium text-white">{stock.symbol}</span>
                <span className="text-[8px] text-gray-300">{stock.price.toFixed(0)}</span>
                <span
                  className={`text-[7px] ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {stock.change >= 0 ? '▲' : '▼'}
                  {Math.abs(stock.change).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/5 bg-slate-800/30 p-2">
          <p className="mb-1 text-[9px] font-semibold text-white">Closing vs opening</p>
          <div className="h-[52px]">
            <svg className="h-full w-full" viewBox="0 0 200 60" preserveAspectRatio="none">
              {[15, 30, 45].map((y) => (
                <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#374151" strokeWidth="0.5" opacity="0.3" />
              ))}
              {closingData.map((d, i) => {
                const x = (i / (closingData.length - 1)) * 200;
                const w = (200 / closingData.length) * 0.7;
                const h = (d.volume / 80) * 55;
                return (
                  <rect
                    key={`bar-${i}`}
                    x={x - w / 2}
                    y={60 - h}
                    width={w}
                    height={h}
                    fill={d.closing >= d.opening ? '#10b981' : '#ef4444'}
                    opacity="0.55"
                  />
                );
              })}
              <polyline
                points={closingData
                  .map((d, i) => {
                    const x = (i / (closingData.length - 1)) * 200;
                    const y = 60 - d.closing * 1800;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-5 gap-1.5">
          <div className="col-span-3 flex min-h-0 flex-col rounded-lg border border-white/5 bg-slate-800/30 p-2">
            <p className="mb-1 text-[9px] font-semibold text-white">Total volume</p>
            <div className="min-h-[44px] flex-1">
              <svg className="h-full w-full" viewBox="0 0 120 44" preserveAspectRatio="none">
                {volumeData.map((v, i) => {
                  const x = (i / (volumeData.length - 1)) * 120;
                  const w = (120 / volumeData.length) * 0.75;
                  const h = (v / 90) * 40;
                  return (
                    <rect
                      key={`vol-${i}`}
                      x={x - w / 2}
                      y={44 - h}
                      width={w}
                      height={h}
                      fill="#3b82f6"
                      opacity="0.75"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          <div className="col-span-2 flex flex-col justify-between rounded-lg border border-white/5 bg-slate-800/30 p-2">
            <p className="text-[8px] font-semibold text-white">Summary</p>
            <div className="space-y-1">
              <div className="flex justify-between text-[7px]">
                <span className="text-gray-400">Vol 7d</span>
                <span className="text-white">2.4M</span>
              </div>
              <div className="flex justify-between text-[7px]">
                <span className="text-gray-400">High</span>
                <span className="text-white">1.78K</span>
              </div>
              <div className="flex items-center gap-0.5 text-[7px] text-green-400">
                <TrendingUp className="h-2.5 w-2.5" />
                <span>+5.2%</span>
              </div>
            </div>
          </div>
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
      <div className="relative flex min-h-[440px] items-start justify-center pt-2">
        <motion.div
          className="relative z-10 shrink-0"
          style={{ marginRight: '-32px' }}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={hasEntered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <PhoneFrame screenHeight={400}>
            <MobilePnlScreen
              pnlAmount={pnlAmount}
              pnlPercent={pnlPercent}
              pnlTrend={pnlTrend}
              candlestickData={candlestickData}
            />
          </PhoneFrame>
        </motion.div>

        <motion.div
          className="relative z-20 mt-16 shrink-0"
          initial={{ opacity: 0, y: 60, x: 40 }}
          animate={hasEntered ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 60, x: 40 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <PhoneFrame screenHeight={400}>
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

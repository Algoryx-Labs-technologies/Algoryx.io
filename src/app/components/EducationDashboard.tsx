import React from 'react';
import { BookOpen, Code2, TrendingUp, Calculator, Play, Video, GraduationCap, Clock, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'motion/react';

interface EducationDashboardProps {
  shouldAnimate: boolean;
  activeLine: number;
  formulaValues: {
    sharpe: number;
    returns: number;
    volatility: number;
  };
}

const courses = [
  {
    id: 1,
    title: 'Algorithmic Trading Foundations',
    description: 'Master the fundamentals of systematic trading',
    duration: '8 weeks',
    progress: 65,
    status: 'active' as const,
    topics: ['Market Basics', 'Order Types', 'Risk Management']
  },
  {
    id: 2,
    title: 'Python for Quant Finance',
    description: 'Learn Python programming for quantitative finance',
    duration: '6 weeks',
    progress: 100,
    status: 'completed' as const,
    topics: ['Pandas & NumPy', 'Data Analysis', 'API Integration']
  },
  {
    id: 3,
    title: 'ML for Trading Strategies',
    description: 'Apply machine learning to trading algorithms',
    duration: '10 weeks',
    progress: 0,
    status: 'upcoming' as const,
    topics: ['ML Models', 'Feature Engineering', 'Model Validation']
  },
  {
    id: 4,
    title: 'Options Trading Strategies',
    description: 'Advanced options trading and Greeks',
    duration: '7 weeks',
    progress: 0,
    status: 'upcoming' as const,
    topics: ['Options Basics', 'Greeks', 'Volatility Trading']
  },
  {
    id: 5,
    title: 'Backtesting & Optimization',
    description: 'Build and test strategies on historical data',
    duration: '5 weeks',
    progress: 0,
    status: 'upcoming' as const,
    topics: ['Backtesting', 'Walk-Forward Analysis', 'Optimization']
  },
  {
    id: 6,
    title: 'Risk Management Fundamentals',
    description: 'Master portfolio risk and position sizing',
    duration: '4 weeks',
    progress: 0,
    status: 'upcoming' as const,
    topics: ['Position Sizing', 'Risk Metrics', 'Portfolio Theory']
  }
];

const videos = [
  {
    id: 1,
    title: 'Introduction to Algorithmic Trading',
    duration: '12:45',
    thumbnail: '📊',
    views: '1.2K',
    status: 'watched'
  },
  {
    id: 2,
    title: 'Python Basics for Finance',
    duration: '18:30',
    thumbnail: '🐍',
    views: '890',
    status: 'watched'
  },
  {
    id: 3,
    title: 'Building Your First Strategy',
    duration: '25:15',
    thumbnail: '⚡',
    views: '654',
    status: 'current'
  },
  {
    id: 4,
    title: 'Backtesting Fundamentals',
    duration: '15:20',
    thumbnail: '📈',
    views: '432',
    status: 'upcoming'
  },
  {
    id: 5,
    title: 'Risk Management Techniques',
    duration: '20:10',
    thumbnail: '🛡️',
    views: '321',
    status: 'upcoming'
  }
];

export function EducationDashboard({ shouldAnimate, activeLine, formulaValues }: EducationDashboardProps) {
  const fixedCode = {
    title: 'Portfolio Optimization',
    lines: [
      { text: 'import numpy as np', type: 'import' },
      { text: 'from scipy.optimize import minimize', type: 'import' },
      { text: '', type: 'empty' },
      { text: 'def portfolio_optimize(returns, cov_matrix):', type: 'def' },
      { text: '    n = len(returns)', type: 'code' },
      { text: '    def objective(weights):', type: 'def' },
      { text: '        portfolio_return = np.dot(weights, returns)', type: 'code' },
      { text: '        portfolio_risk = np.sqrt(', type: 'code' },
      { text: '            np.dot(weights.T, np.dot(cov_matrix, weights))', type: 'code' },
      { text: '        )', type: 'code' },
      { text: '        return -portfolio_return / portfolio_risk', type: 'code' },
    ]
  };

  return (
    <div 
      className="bg-gradient-to-br from-slate-900 to-black overflow-hidden relative h-full flex flex-col"
      style={{
        imageRendering: 'crisp-edges',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility'
      }}
    >
      {/* Top Bar - Code Editor Header */}
      <div className="bg-slate-800/50 border-b border-white/10 px-6 py-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            portfolio_optimize.py
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 flex-1 overflow-hidden">
        {/* Left Column - Code Editor */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Code Editor */}
          <div className="bg-slate-800/30 rounded-lg border border-white/5 overflow-hidden flex-1 flex flex-col">
            <div className="p-3 text-xs flex-1 overflow-auto" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <div className="text-gray-300 leading-relaxed">
                {fixedCode.lines.map((line, index) => {
                  const isActive = shouldAnimate && activeLine === index;
                  let textColor = 'text-gray-300';
                  
                  if (line.type === 'import') textColor = 'text-cyan-400';
                  else if (line.type === 'def') textColor = 'text-purple-400';
                  else if (line.type === 'return') textColor = 'text-yellow-400';
                  else if (line.type === 'code') textColor = 'text-gray-300';
                  
                  return (
                    <div 
                      key={index}
                      className={`relative ${isActive ? 'bg-blue-500/10' : ''} transition-colors duration-300 px-1 -mx-1 rounded`}
                    >
                      <span className={textColor}>
                        {line.text || ' '}
                      </span>
                      {isActive && (
                        <span className="absolute right-2 top-0 w-0.5 h-4 bg-cyan-400 animate-pulse"></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Formula Card */}
          <div className="bg-slate-800/30 rounded-lg p-3 border border-white/5 mt-3">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-3 h-3 text-blue-400" />
              <h4 className="text-white text-xs font-semibold">Risk Metrics</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[10px]">Sharpe Ratio:</span>
                <span className="text-green-400 font-mono text-[10px]">
                  {formulaValues.sharpe.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[10px]">Annual Returns:</span>
                <span className="text-green-400 font-mono text-[10px]">
                  {formulaValues.returns.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[10px]">Volatility:</span>
                <span className="text-yellow-400 font-mono text-[10px]">
                  {formulaValues.volatility.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Learning Resources */}
        <div className="space-y-2 flex flex-col">
          {/* Progress */}
          <div className="bg-slate-800/30 rounded-lg p-3 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white text-xs font-semibold">Progress</h4>
              <span className="text-gray-500 text-[10px]">65%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                initial={{ width: '0%' }}
                animate={shouldAnimate ? { width: '65%' } : { width: '0%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Learning Resources */}
          <div className="bg-slate-800/30 rounded-lg p-3 border border-white/5 flex-1">
            <h4 className="text-white text-xs font-semibold mb-2">Resources</h4>
            <div className="space-y-1.5">
              {[
                { icon: BookOpen, title: 'Portfolio Theory', status: 'completed' },
                { icon: TrendingUp, title: 'Risk Management', status: 'active' },
                { icon: Code2, title: 'Python Basics', status: 'upcoming' },
              ].map((resource, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                  <resource.icon className={`w-3 h-3 ${
                    resource.status === 'completed' ? 'text-green-400' :
                    resource.status === 'active' ? 'text-blue-400' :
                    'text-gray-500'
                  }`} />
                  <span className={`${
                    resource.status === 'completed' ? 'text-gray-300' :
                    resource.status === 'active' ? 'text-blue-300' :
                    'text-gray-500'
                  }`}>
                    {resource.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Formula Reference */}
          <div className="bg-slate-800/30 rounded-lg p-3 border border-white/5">
            <h4 className="text-white text-xs font-semibold mb-1.5">Key Formula</h4>
            <div className="bg-slate-900/50 rounded p-2 text-[10px] font-mono text-gray-300">
              <div className="text-cyan-400 mb-0.5">Sharpe Ratio =</div>
              <div className="pl-3 text-[9px]">
                (Rₚ - Rf) / σₚ
              </div>
              <div className="text-gray-500 text-[8px] mt-1.5">
                Rₚ = Portfolio Return<br/>
                Rf = Risk-free Rate<br/>
                σₚ = Portfolio Volatility
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EducationVideos() {
  return (
    <div 
      className="bg-gradient-to-br from-slate-900 to-black overflow-hidden relative h-full flex flex-col"
      style={{
        imageRendering: 'crisp-edges',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility'
      }}
    >
      {/* Top Bar */}
      <div className="bg-slate-800/50 border-b border-white/10 px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">Video Library</span>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="p-4 flex-1 overflow-hidden flex flex-col">
        <div className="space-y-2 h-full flex flex-col">
          {videos.map((video) => (
            <div
              key={video.id}
              className={`bg-slate-800/30 rounded-lg p-3 border border-white/5 flex items-center gap-3 flex-shrink-0 ${
                video.status === 'current' ? 'ring-2 ring-blue-500/50' : ''
              }`}
            >
              <div className="w-16 h-10 bg-slate-700 rounded flex items-center justify-center text-2xl flex-shrink-0">
                {video.thumbnail}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white text-xs font-semibold truncate">{video.title}</h4>
                  {video.status === 'watched' && (
                    <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                  )}
                  {video.status === 'current' && (
                    <Play className="w-3 h-3 text-blue-400 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </span>
                  <span>{video.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EducationCourses() {
  return (
    <div 
      className="bg-gradient-to-br from-slate-900 to-black overflow-hidden relative h-full flex flex-col"
      style={{
        imageRendering: 'crisp-edges',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility'
      }}
    >
      {/* Top Bar */}
      <div className="bg-slate-800/50 border-b border-white/10 px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">All Courses</span>
        </div>
      </div>

      {/* Courses List - Non-scrollable, fits all courses */}
      <div className="p-4 flex-1 overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 gap-2 h-full" style={{ gridTemplateRows: 'repeat(6, minmax(0, 1fr))' }}>
          {courses.map((course) => (
            <div
              key={course.id}
              className={`bg-slate-800/30 rounded-lg p-2 border border-white/5 flex items-center gap-3 ${
                course.status === 'active' ? 'ring-2 ring-blue-500/50' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {course.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : course.status === 'active' ? (
                  <Circle className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-white text-[11px] font-semibold truncate">{course.title}</h4>
                  <span className="text-gray-500 text-[9px] ml-2 flex-shrink-0">{course.duration}</span>
                </div>
                <p className="text-gray-400 text-[9px] mb-1 truncate">{course.description}</p>
                {course.status === 'active' && course.progress > 0 && (
                  <div className="w-full h-0.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      initial={{ width: '0%' }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
                {course.status === 'completed' && (
                  <div className="flex items-center gap-1 text-[9px] text-green-400">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Completed</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


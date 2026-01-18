'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';

function ClockDisplay() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours24 = time.getHours();
  const hours12 = hours24 % 12 || 12; // Convert to 12-hour format (1-12)
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hours = hours24.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const dayName = time.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = time.toLocaleDateString('en-US', { month: 'long' });
  const day = time.getDate();

  // Circle center and radii (adjusted for 100x100 viewBox)
  const centerX = 50;
  const centerY = 50;
  const innerRadius = 32; // Inner ring for hours
  const middleRadius = 36; // Middle ring for minutes
  const outerRadius = 40; // Outer ring for seconds

  // Start angle: -90 degrees = 12 o'clock (top)
  // In SVG: 0° = 3 o'clock, 90° = 6 o'clock, 180° = 9 o'clock, 270° = 12 o'clock
  // So -90° or 270° = 12 o'clock (top)
  const startAngle = -90;

  // Calculate seconds progress: 60 seconds = 360 degrees
  const secondsProgress = (seconds / 60) * 360;
  const secondsEndAngle = startAngle + secondsProgress;

  // Calculate minutes progress: 60 minutes = 360 degrees
  // Include seconds for smooth movement
  const minutesProgress = ((minutes * 60 + seconds) / 3600) * 360;
  const minutesEndAngle = startAngle + minutesProgress;

  // Calculate hours progress: 12 hours = 360 degrees
  // Include hours, minutes, and seconds for smooth movement
  const totalSecondsIn12Hours = ((hours12 === 12 ? 0 : hours12) * 3600) + minutes * 60 + seconds;
  const hoursProgress = (totalSecondsIn12Hours / 43200) * 360; // 43200 seconds = 12 hours
  const hoursEndAngle = startAngle + hoursProgress;

  // Helper function to create arc path
  const createArcPath = (radius: number, startAngleDeg: number, endAngleDeg: number) => {
    const startRad = (startAngleDeg * Math.PI) / 180;
    const endRad = (endAngleDeg * Math.PI) / 180;
    
    const startX = centerX + radius * Math.cos(startRad);
    const startY = centerY + radius * Math.sin(startRad);
    const endX = centerX + radius * Math.cos(endRad);
    const endY = centerY + radius * Math.sin(endRad);
    
    const progress = endAngleDeg - startAngleDeg;
    const largeArcFlag = Math.abs(progress) > 180 ? 1 : 0;
    const sweepFlag = progress > 0 ? 1 : 0;
    
    return {
      path: `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`,
      startX,
      startY,
      endX,
      endY,
    };
  };

  // Create arc paths
  const hoursArc = createArcPath(innerRadius, startAngle, hoursEndAngle);
  const minutesArc = createArcPath(middleRadius, startAngle, minutesEndAngle);
  const secondsArc = createArcPath(outerRadius, startAngle, secondsEndAngle);

  return (
    <div className="relative w-full min-h-[120px] flex items-center justify-center">
      {/* Grid background pattern - teal-blue dots */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(20, 184, 166, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '12px 12px',
          backgroundPosition: '0 0',
        }}
      />
      
      <div className="relative z-10 w-full flex items-center justify-between px-1.5">
        {/* Date Display - Left Side */}
        <div className="flex flex-col text-white">
          <div className="text-xs font-semibold font-hero mb-0.5">{dayName}</div>
          <div className="text-sm font-semibold font-hero">{monthName} {day}</div>
        </div>

        {/* Clock Display - Right Side */}
        <div className="relative flex items-center justify-center">
          <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-lg">
            {/* Outer circle track - dark gray for seconds */}
            <circle
              cx={centerX}
              cy={centerY}
              r={outerRadius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2.5"
            />
            
            {/* Middle circle track - dark gray for minutes */}
            <circle
              cx={centerX}
              cy={centerY}
              r={middleRadius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2.5"
            />
            
            {/* Inner circle track - dark gray for hours */}
            <circle
              cx={centerX}
              cy={centerY}
              r={innerRadius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
            />
            
            {/* Outer ring - Seconds arc (lighter teal-blue with glow) */}
            <path
              d={secondsArc.path}
              fill="none"
              stroke="rgb(94, 234, 212)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 3px rgba(94, 234, 212, 0.5))',
              }}
            />
            
            {/* Middle ring - Minutes arc (medium teal-blue with glow) */}
            <path
              d={minutesArc.path}
              fill="none"
              stroke="rgb(56, 189, 248)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 3.5px rgba(56, 189, 248, 0.55))',
              }}
            />
            
            {/* Inner ring - Hours arc (teal-blue with glow) */}
            <path
              d={hoursArc.path}
              fill="none"
              stroke="rgb(20, 184, 166)"
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(20, 184, 166, 0.6))',
              }}
            />
            
            {/* Start dots at 12 o'clock position */}
            {/* Hours ring start dot */}
            <circle
              cx={hoursArc.startX}
              cy={hoursArc.startY}
              r="3"
              fill="white"
              style={{
                filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.8))',
              }}
            />
            
            {/* Minutes ring start dot */}
            <circle
              cx={minutesArc.startX}
              cy={minutesArc.startY}
              r="2.5"
              fill="white"
              style={{
                filter: 'drop-shadow(0 0 2.5px rgba(255, 255, 255, 0.75))',
              }}
            />
            
            {/* Seconds ring start dot */}
            <circle
              cx={secondsArc.startX}
              cy={secondsArc.startY}
              r="2.5"
              fill="white"
              style={{
                filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.7))',
              }}
            />
            
            {/* End dots (current position) */}
            {/* Hours ring end dot */}
            <circle
              cx={hoursArc.endX}
              cy={hoursArc.endY}
              r="4"
              fill="white"
              style={{
                filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 1))',
              }}
            />
            
            {/* Minutes ring end dot */}
            <circle
              cx={minutesArc.endX}
              cy={minutesArc.endY}
              r="3.5"
              fill="white"
              style={{
                filter: 'drop-shadow(0 0 4.5px rgba(255, 255, 255, 0.95))',
              }}
            />
            
            {/* Seconds ring end dot */}
            <circle
              cx={secondsArc.endX}
              cy={secondsArc.endY}
              r="3"
              fill="white"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.9))',
              }}
            />
          </svg>
          
          {/* Time display in center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-lg font-bold text-white font-hero tracking-wider">
              {hours}:{minutesStr}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileWidget() {
  return (
    <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col">
      <CardHeader className="px-2 pt-2 pb-1 flex-shrink-0">
        <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-1">
          <User className="h-5 w-5 text-blue-400" />
          Profile
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-xs mt-0.5">
          Your account information
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-1">
              <User className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-white font-footer font-semibold">John Doe</p>
            <p className="text-xs text-gray-400 font-footer">john.doe@company.com</p>
          </div>
          
          {/* Clock UI */}
          <div className="mt-2 pt-2 border-t border-white/10">
            <ClockDisplay />
          </div>
          
          <div className="space-y-0.5 pt-1 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 font-footer">Name</span>
              <span className="text-xs text-white font-footer">John Doe</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 font-footer">Email</span>
              <span className="text-xs text-white font-footer truncate ml-2">john.doe@company.com</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


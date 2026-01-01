import React, { useEffect, useRef } from 'react';

export function RotatingSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Floating text labels inside the sphere
    const textLabels = [
      { text: 'Research', lat: 0, lon: 0 },
      { text: 'Portfolio', lat: Math.PI / 4, lon: Math.PI / 2 },
      { text: 'Max Drawdown', lat: -Math.PI / 4, lon: Math.PI },
      { text: 'Profit Factor', lat: Math.PI / 3, lon: -Math.PI / 2 },
      { text: 'Sharpe Ratio', lat: -Math.PI / 3, lon: -Math.PI },
      { text: 'Volatility', lat: Math.PI / 6, lon: Math.PI / 4 },
      { text: 'Win Rate', lat: -Math.PI / 6, lon: -Math.PI / 4 },
    ];

    // Initial entrance animation state
    let rotationX = -Math.PI / 2; // Start from top (-90 degrees)
    let rotationY = -Math.PI / 2; // Start from left (-90 degrees)
    let entranceProgress = 0;
    const entranceDuration = 2000; // 2 seconds for entrance
    const startTime = Date.now();
    let isEntranceComplete = false;
    let floatTime = 0; // For floating animation

    // Easing function for smooth entrance
    const easeOutCubic = (t: number) => {
      return 1 - Math.pow(1 - t, 3);
    };

    const drawSphere = () => {
      ctx.clearRect(0, 0, width, height);

      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      // Handle entrance animation
      if (!isEntranceComplete && elapsed < entranceDuration) {
        entranceProgress = Math.min(elapsed / entranceDuration, 1);
        const easedProgress = easeOutCubic(entranceProgress);

        // Animate from top (-90) to front (0) on X axis
        rotationX = -Math.PI / 2 + (Math.PI / 2) * easedProgress;
        // Animate from left (-90) to center (0) on Y axis
        rotationY = -Math.PI / 2 + (Math.PI / 2) * easedProgress;
      } else if (!isEntranceComplete) {
        // Entrance complete, reset to normal rotation
        isEntranceComplete = true;
        rotationX = 0;
        rotationY = 0;
      } else {
        // Normal continuous rotation (only Y axis, like Earth)
        rotationY += 0.008;
        floatTime += 0.01; // Update floating animation time
      }

      // Draw longitude lines (vertical circles)
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 1.5;

        for (let j = 0; j <= 100; j++) {
          const t = (j / 100) * Math.PI * 2;
          const x = centerX + radius * Math.cos(t) * Math.cos(angle + rotationY);
          const y = centerY + radius * Math.sin(t);
          const z = radius * Math.cos(t) * Math.sin(angle + rotationY);

          // Apply rotation around X axis (for entrance animation)
          const rotatedY = y * Math.cos(rotationX) - z * Math.sin(rotationX);
          const rotatedZ = y * Math.sin(rotationX) + z * Math.cos(rotationX);

          // Perspective projection
          const scale = 1 + rotatedZ / (radius * 2);
          const screenX = centerX + (x - centerX) * scale;
          const screenY = centerY + (rotatedY - centerY) * scale;

          if (j === 0) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
        ctx.stroke();
      }

      // Draw latitude lines (horizontal circles)
      for (let i = 0; i < 8; i++) {
        const lat = ((i / 8) - 0.5) * Math.PI;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 1.5;

        for (let j = 0; j <= 100; j++) {
          const lon = (j / 100) * Math.PI * 2;
          const x = centerX + radius * Math.cos(lat) * Math.cos(lon + rotationY);
          const y = centerY + radius * Math.sin(lat);
          const z = radius * Math.cos(lat) * Math.sin(lon + rotationY);

          // Apply rotation around X axis (for entrance animation)
          const rotatedY = y * Math.cos(rotationX) - z * Math.sin(rotationX);
          const rotatedZ = y * Math.sin(rotationX) + z * Math.cos(rotationX);

          // Perspective projection
          const scale = 1 + rotatedZ / (radius * 2);
          const screenX = centerX + (x - centerX) * scale;
          const screenY = centerY + (rotatedY - centerY) * scale;

          if (j === 0) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
        ctx.stroke();
      }

      // Draw floating text labels inside the sphere
      ctx.save();
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      textLabels.forEach((label, index) => {
        // Calculate 3D position on sphere surface (inside, at 70% of radius)
        const textRadius = radius * 0.7;
        const lat = label.lat + Math.sin(floatTime + index) * 0.1; // Subtle floating
        const lon = label.lon + rotationY + Math.cos(floatTime + index * 0.5) * 0.05;

        // Convert spherical to Cartesian coordinates
        const x = centerX + textRadius * Math.cos(lat) * Math.cos(lon);
        const y = centerY + textRadius * Math.sin(lat);
        const z = textRadius * Math.cos(lat) * Math.sin(lon);

        // Apply rotation around X axis (for entrance animation)
        const rotatedY = y * Math.cos(rotationX) - z * Math.sin(rotationX);
        const rotatedZ = y * Math.sin(rotationX) + z * Math.cos(rotationX);

        // Only draw if facing forward (z > -radius/2 for visibility)
        if (rotatedZ > -radius * 0.5) {
          // Perspective projection
          const scale = Math.max(0.3, 1 + rotatedZ / (radius * 2));
          const screenX = centerX + (x - centerX) * scale;
          const screenY = centerY + (rotatedY - centerY) * scale;

          // Calculate opacity based on depth
          const opacity = Math.min(1, Math.max(0.4, (rotatedZ + radius) / (radius * 1.5)));

          // Draw text with glow effect
          ctx.globalAlpha = opacity;
          ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
          ctx.fillText(label.text, screenX, screenY);
          
          // Reset shadow
          ctx.shadowBlur = 0;
        }
      });

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(drawSphere);
    };

    drawSphere();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className="w-full h-full"
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}


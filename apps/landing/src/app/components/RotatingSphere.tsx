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

    // Floating text labels inside the sphere with connections
    const textLabels = [
      { text: 'Research', lat: 0, lon: 0, connections: [1, 3] },
      { text: 'Portfolio', lat: Math.PI / 4, lon: Math.PI / 2, connections: [0, 4] },
      { text: 'Max Drawdown', lat: -Math.PI / 4, lon: Math.PI, connections: [4, 5] },
      { text: 'Profit Factor', lat: Math.PI / 3, lon: -Math.PI / 2, connections: [0, 6] },
      { text: 'Sharpe Ratio', lat: -Math.PI / 3, lon: -Math.PI, connections: [1, 2, 5] },
      { text: 'Volatility', lat: Math.PI / 6, lon: Math.PI / 4, connections: [2, 4] },
      { text: 'Win Rate', lat: -Math.PI / 6, lon: -Math.PI / 4, connections: [3] },
    ];

    // Store text positions for connection lines
    const textPositions: Array<{ x: number; y: number; z: number; screenX: number; screenY: number; visible: boolean }> = [];

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

    // Dynamic color function based on rotation
    const getDynamicColor = (angle: number, baseColor: number[]) => {
      const hueShift = (Math.sin(angle) + 1) * 0.5; // 0 to 1
      const r = Math.floor(baseColor[0] + (167 - baseColor[0]) * hueShift * 0.3);
      const g = Math.floor(baseColor[1] + (211 - baseColor[1]) * hueShift * 0.3);
      const b = Math.floor(baseColor[2] + (238 - baseColor[2]) * hueShift * 0.3);
      return `rgba(${r}, ${g}, ${b}, ${0.3 + hueShift * 0.2})`;
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

      // Draw longitude lines (vertical circles) with dynamic colors
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        // Dynamic color based on rotation
        const colorAngle = angle + rotationY;
        ctx.strokeStyle = getDynamicColor(colorAngle, [59, 130, 246]);
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

      // Draw latitude lines (horizontal circles) with dynamic colors
      for (let i = 0; i < 8; i++) {
        const lat = ((i / 8) - 0.5) * Math.PI;
        ctx.beginPath();
        // Dynamic color based on rotation
        const colorAngle = lat + rotationY;
        ctx.strokeStyle = getDynamicColor(colorAngle, [6, 182, 212]);
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

      // Clear text positions array
      textPositions.length = 0;

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
        const isVisible = rotatedZ > -radius * 0.5;
        
        if (isVisible) {
          // Perspective projection
          const scale = Math.max(0.3, 1 + rotatedZ / (radius * 2));
          const screenX = centerX + (x - centerX) * scale;
          const screenY = centerY + (rotatedY - centerY) * scale;

          // Calculate opacity based on depth
          const opacity = Math.min(1, Math.max(0.4, (rotatedZ + radius) / (radius * 1.5)));

          // Store position for connection lines
          textPositions[index] = { x, y, z, screenX, screenY, visible: true };

          // Draw text with glow effect
          ctx.globalAlpha = opacity;
          ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
          ctx.fillText(label.text, screenX, screenY);
          
          // Reset shadow
          ctx.shadowBlur = 0;
        } else {
          textPositions[index] = { x, y, z, screenX: 0, screenY: 0, visible: false };
        }
      });

      ctx.restore();

      // Draw connection lines between related terms
      textLabels.forEach((label, index) => {
        if (!textPositions[index]?.visible) return;

        label.connections.forEach((connectedIndex) => {
          if (!textPositions[connectedIndex]?.visible) return;

          const start = textPositions[index];
          const end = textPositions[connectedIndex];

          // Calculate distance in 3D space
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const dz = end.z - start.z;
          const distance3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Only draw if terms are reasonably close
          if (distance3D < radius * 1.2) {
            ctx.beginPath();
            ctx.moveTo(start.screenX, start.screenY);
            ctx.lineTo(end.screenX, end.screenY);

            // Subtle animated connection line
            const pulse = (Math.sin(floatTime * 2 + index) + 1) * 0.5;
            const opacity = 0.2 + pulse * 0.2;
            const colorAngle = rotationY + index;
            const lineColor = getDynamicColor(colorAngle, [59, 130, 246]);
            
            ctx.strokeStyle = lineColor.replace(')', `, ${opacity})`).replace('rgba', 'rgba');
            ctx.lineWidth = 0.8;
            ctx.setLineDash([6, 4]);
            ctx.lineDashOffset = floatTime * 8;
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      });

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


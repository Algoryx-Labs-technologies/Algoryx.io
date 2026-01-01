import React, { useEffect, useRef } from 'react';

export function RotatingSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

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

    let rotationX = 0;
    let rotationY = 0;

    const drawSphere = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw longitude lines (vertical circles)
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 + Math.sin(angle + rotationY) * 0.1})`;
        ctx.lineWidth = 1.5;

        for (let j = 0; j <= 100; j++) {
          const t = (j / 100) * Math.PI * 2;
          const x = centerX + radius * Math.cos(t) * Math.cos(angle + rotationY);
          const y = centerY + radius * Math.sin(t);
          const z = radius * Math.cos(t) * Math.sin(angle + rotationY);

          // Apply rotation around X axis
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
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 + Math.cos(lat + rotationX) * 0.1})`;
        ctx.lineWidth = 1.5;

        for (let j = 0; j <= 100; j++) {
          const lon = (j / 100) * Math.PI * 2;
          const x = centerX + radius * Math.cos(lat) * Math.cos(lon + rotationY);
          const y = centerY + radius * Math.sin(lat);
          const z = radius * Math.cos(lat) * Math.sin(lon + rotationY);

          // Apply rotation around X axis
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

      // Update rotation
      rotationY += 0.01;
      rotationX += 0.005;

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


import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine.ts';

interface AudioVisualizerProps {
  isPlaying: boolean;
  accentColor: string;
  barsCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  accentColor,
  barsCount = 28,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const data = audioEngine.getFrequencyData();
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / barsCount) * 0.7;
      const gap = (width / barsCount) * 0.3;

      for (let i = 0; i < barsCount; i++) {
        // Map frequency bins
        const dataIdx = Math.floor((i / barsCount) * (data.length * 0.75));
        const val = isPlaying ? (data[dataIdx] || 0) / 255 : 0.05;
        
        const barHeight = Math.max(3, val * height * 0.9);
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        // AMOLED clean bar style
        ctx.fillStyle = isPlaying ? '#ffffff' : 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, barsCount, accentColor]);

  return (
    <div className="flex items-center justify-center h-6 opacity-70 hover:opacity-100 transition-opacity">
      <canvas
        ref={canvasRef}
        width={140}
        height={24}
        className="w-28 sm:w-36 h-5"
      />
    </div>
  );
};

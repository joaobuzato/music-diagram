import { useRef, useEffect } from 'react';
import type { Instrument } from './types';
import { FREQ_COLORS } from './constants';
import { drawStereoField } from './utils/drawStereo';
import styles from './MusicDiagram.module.css';

interface StereoCanvasProps {
  instruments: Instrument[];
  activeSection: number;
  sectionName: string;
}

export function StereoCanvas({ instruments, activeSection, sectionName }: Readonly<StereoCanvasProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const logW = rect.width || 276;
    const logH = rect.height || 210;

    canvas.width = logW * dpr;
    canvas.height = logH * dpr;
    ctx.scale(dpr, dpr);

    drawStereoField(ctx, logW, logH, instruments, activeSection, FREQ_COLORS);
  }, [instruments, activeSection]);

  return (
    <canvas
      ref={canvasRef}
      width={276}
      height={210}
      className={styles.stereoCanvas}
      aria-label={`Campo estéreo da seção ${sectionName}: posicionamento panorâmico e proeminência dos instrumentos`}
    >
      Campo estéreo da seção {sectionName}
    </canvas>
  );
}

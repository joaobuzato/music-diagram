import { useRef, useEffect } from 'react';
import type { InstrumentGroup } from './types';
import { FREQ_COLORS } from './constants';
import { drawStereoField } from './utils/drawStereo';
import styles from './MusicDiagram.module.css';

interface StereoCanvasProps {
  groups: InstrumentGroup[];
  activeSection: number;
}

export function StereoCanvas({ groups, activeSection }: Readonly<StereoCanvasProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawStereoField(ctx, canvas.width, canvas.height, groups, activeSection, FREQ_COLORS);
  }, [groups, activeSection]);

  return (
    <canvas
      ref={canvasRef}
      width={276}
      height={210}
      className={styles.stereoCanvas}
    />
  );
}

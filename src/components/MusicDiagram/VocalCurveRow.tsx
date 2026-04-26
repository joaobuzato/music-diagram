import type { VocalInstrument } from './types';
import { CELL_WIDTH, CELL_GAP, VOCAL_CURVE_H } from './constants';
import { buildCubicBezierPath, buildFillPath, type Point } from './utils/svgPath';
import styles from './MusicDiagram.module.css';

interface VocalCurveRowProps {
  instrument: VocalInstrument;
  sections: string[];
  activeSection: number;
}

export function VocalCurveRow({ instrument, sections, activeSection }: Readonly<VocalCurveRowProps>) {
  const N = sections.length;
  const totalW = N * CELL_WIDTH + (N - 1) * CELL_GAP;
  const H = VOCAL_CURVE_H;

  const pts: Point[] = instrument.data.map((d, i) => ({
    x: i * (CELL_WIDTH + CELL_GAP) + CELL_WIDTH / 2,
    y: H - 4 - d.intensity * (H - 10),
  }));

  const strokeD = buildCubicBezierPath(pts);
  const fillD   = buildFillPath(strokeD, pts, H);

  const highlightX = activeSection * (CELL_WIDTH + CELL_GAP);

  return (
    <>
      <div className={styles.vocalCurveRow}>
        <div className={styles.vocalCurveLabel}>
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: instrument.color,
              flexShrink: 0,
            }}
          />
          {instrument.name}
        </div>
        <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ position: 'relative', height: H, flexShrink: 0 }}>
          <svg width={totalW} height={H}>
            {[0.25, 0.5, 0.75, 1].map(v => {
              const y = H - v * (H - 6) - 3;
              return (
                <line key={v} x1={0} x2={totalW} y1={y} y2={y} stroke="#1a1a2e" strokeWidth={1} />
              );
            })}
            <rect
              x={highlightX}
              width={CELL_WIDTH}
              height={H}
              fill="rgba(245,166,35,0.08)"
              rx={2}
            />
            <path d={fillD} fill={instrument.color} opacity={0.12} />
            <path d={strokeD} fill="none" stroke={instrument.color} strokeWidth={1.5} opacity={0.85} />
            {pts.map((p, i) => {
              const intensity = instrument.data[i].intensity;
              const pct = Math.round(intensity * 100);
              return (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={intensity > 0 ? 3 : 1.5}
                    fill={instrument.color}
                    opacity={intensity > 0 ? 0.9 : 0.3}
                  />
                  {intensity > 0 && (
                    <text
                      x={p.x}
                      y={p.y - 5}
                      textAnchor="middle"
                      fontSize={6}
                      fill={instrument.color}
                      opacity={0.7}
                    >
                      {pct}%
                    </text>
                  )}
                </g>
              );
            })}
            {Array.from({ length: N - 1 }, (_, i) => {
              const x = (i + 1) * (CELL_WIDTH + CELL_GAP) - CELL_GAP / 2;
              return (
                <line key={i} x1={x} x2={x} y1={0} y2={H} stroke="#1a1a2e" strokeWidth={1} />
              );
            })}
          </svg>
        </div>
      </div>
      <div className={styles.vocalSubLabel}>
        — intensidade emocional (não é volume)
      </div>
    </>
  );
}

import type { Section } from './types';
import { tempoWidth } from './utils/tempo';
import styles from './MusicDiagram.module.css';

interface PanRulerProps {
  sections: Section[];
}

export function PanRuler({ sections }: Readonly<PanRulerProps>) {
  return (
    <div className={styles.panRulerRow}>
      {sections.map((sec, i) => {
        const w = tempoWidth(sec.tempo);
        return (
          <div key={`${sec.name}-${i}`} className={styles.panRulerCell} style={{ width: w }}>
            {(['L', 'C', 'R'] as const).map((lbl, j) => (
              <span
                key={lbl}
                className={styles.panTick}
                style={{ left: (j * 50) + '%' }}
              >
                {lbl}
              </span>
            ))}
            <svg width={w} height={10} style={{ position: 'absolute', bottom: 0 }}>
              {[0, 50, 100].map(x => (
                <line
                  key={x}
                  x1={(x / 100) * w}
                  x2={(x / 100) * w}
                  y1={5}
                  y2={10}
                  stroke="#252540"
                  strokeWidth={1}
                />
              ))}
            </svg>
          </div>
        );
      })}
    </div>
  );
}

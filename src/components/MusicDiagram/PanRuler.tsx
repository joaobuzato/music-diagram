import { CELL_WIDTH } from './constants';
import styles from './MusicDiagram.module.css';

interface PanRulerProps {
  count: number;
}

export function PanRuler({ count }: Readonly<PanRulerProps>) {
  return (
    <div className={styles.panRulerRow}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.panRulerCell}>
          {(['L', 'C', 'R'] as const).map((lbl, j) => (
            <span
              key={lbl}
              className={styles.panTick}
              style={{ left: (j * 50) + '%' }}
            >
              {lbl}
            </span>
          ))}
          <svg width={CELL_WIDTH} height={10} style={{ position: 'absolute', bottom: 0 }}>
            {[0, 50, 100].map(x => (
              <line
                key={x}
                x1={(x / 100) * CELL_WIDTH}
                x2={(x / 100) * CELL_WIDTH}
                y1={5}
                y2={10}
                stroke="#252540"
                strokeWidth={1}
              />
            ))}
          </svg>
        </div>
      ))}
    </div>
  );
}


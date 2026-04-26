import { FREQ_COLORS } from './constants';
import styles from './MusicDiagram.module.css';

const LABELS: Record<string, string> = {
  'sub':      'Sub / Graves',
  'low-mid':  'Médios-Baixos',
  'high-mid': 'Médios-Altos',
  'high':     'Agudos',
  'vocal':    'Vocal',
};

export function FreqLegend() {
  return (
    <div className={styles.freqLegend}>
      {(Object.entries(FREQ_COLORS) as [string, string][]).map(([band, color]) => (
        <div key={band} className={styles.freqItem}>
          <div className={styles.freqPill} style={{ background: color }} />
          {LABELS[band]}
        </div>
      ))}
    </div>
  );
}

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
    <ul className={styles.freqLegend} aria-label="Legenda de frequências" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {(Object.entries(FREQ_COLORS) as [string, string][]).map(([band, color]) => (
        <li key={band} className={styles.freqItem}>
          <span className={styles.freqPill} aria-hidden="true" style={{ background: color }} />
          {LABELS[band]}
        </li>
      ))}
    </ul>
  );
}

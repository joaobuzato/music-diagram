import type { RegularInstrument } from './types';
import { SectionCell } from './SectionCell';
import styles from './MusicDiagram.module.css';

interface InstrumentRowProps {
  instrument: RegularInstrument;
  sections: string[];
  activeSection: number;
  onSectionChange: (index: number) => void;
}

export function InstrumentRow({ instrument, sections, activeSection, onSectionChange }: Readonly<InstrumentRowProps>) {
  return (
    <div className={styles.instRow}>
      <div className={styles.instName}>{instrument.name}</div>
      <div className={styles.instDot} style={{ background: instrument.color }} />
      <div className={styles.cellsTrack}>
        {sections.map((_, i) => (
          <SectionCell
            key={i}
            data={instrument.data[i]}
            color={instrument.color}
            isActive={i === activeSection}
            onClick={() => onSectionChange(i)}
          />
        ))}
      </div>
    </div>
  );
}

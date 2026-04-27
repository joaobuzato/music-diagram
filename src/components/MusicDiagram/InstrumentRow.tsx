import type { RegularInstrument } from './types';
import { SectionCell } from './SectionCell';
import styles from './MusicDiagram.module.css';

interface InstrumentRowProps {
  instrument: RegularInstrument;
  sections: string[];
  activeSection: number;
  onSectionChange: (index: number) => void;
}

function panLabel(pan: number): string {
  if (pan < -0.15) return 'esquerda';
  if (pan > 0.15) return 'direita';
  return 'centro';
}

export function InstrumentRow({ instrument, sections, activeSection, onSectionChange }: Readonly<InstrumentRowProps>) {
  return (
    <div className={styles.instRow} aria-label={instrument.name}>
      <div className={styles.instName}>{instrument.name}</div>
      <div className={styles.instDot} aria-hidden="true" style={{ background: instrument.color }} />
      <fieldset className={styles.cellsTrack} style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ display: 'none' }}>{`Seções de ${instrument.name}`}</legend>
        {sections.map((sec, i) => {
          const d = instrument.data[i];
          const label = d.dyn === 0
            ? `${instrument.name}, ${sec}: silenciado`
            : `${instrument.name}, ${sec}: dinâmica ${Math.round(d.dyn * 100)}%, pan ${panLabel(d.pan)}`;
          return (
            <SectionCell
              key={sec}
              data={d}
              color={instrument.color}
              isActive={i === activeSection}
              onClick={() => onSectionChange(i)}
              ariaLabel={label}
            />
          );
        })}
      </fieldset>
    </div>
  );
}

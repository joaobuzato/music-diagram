import type { Instrument, Section, SectionData } from './types';
import { SectionCell } from './SectionCell';
import { EditableLabel } from './EditableLabel';
import { tempoWidth } from './utils/tempo';
import styles from './MusicDiagram.module.css';

interface InstrumentRowProps {
  instrument: Instrument;
  sections: Section[];
  activeSection: number;
  onSectionChange: (index: number) => void;
  onUpdateSectionData: (instrumentId: string, sectionIndex: number, next: SectionData) => void;
  onUpdateInstrumentName: (instrumentId: string, name: string) => void;
}

function panLabel(pan: number): string {
  if (pan < -0.15) return 'esquerda';
  if (pan > 0.15) return 'direita';
  return 'centro';
}

export function InstrumentRow({ instrument, sections, activeSection, onSectionChange, onUpdateSectionData, onUpdateInstrumentName }: Readonly<InstrumentRowProps>) {
  return (
    <div className={styles.instRow} aria-label={instrument.name}>
      <EditableLabel
        value={instrument.name}
        onCommit={(next) => onUpdateInstrumentName(instrument.id, next)}
        ariaLabel="Nome do instrumento"
        className={styles.instName}
        inputClassName={styles.instNameInput}
        maxLength={32}
      />
      <div className={styles.instDot} aria-hidden="true" style={{ background: instrument.color }} />
      <fieldset className={styles.cellsTrack} style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ display: 'none' }}>{`Seções de ${instrument.name}`}</legend>
        {sections.map((sec, i) => {
          const d = instrument.data[i];
          const label = d.dyn === 0
            ? `${instrument.name}, ${sec.name}: silenciado`
            : `${instrument.name}, ${sec.name}: dinâmica ${Math.round(d.dyn * 100)}%, pan ${panLabel(d.pan)}`;
          return (
            <SectionCell
              key={`${sec.name}-${i}`}
              data={d}
              color={instrument.color}
              isActive={i === activeSection}
              width={tempoWidth(sec.tempo)}
              onClick={() => onSectionChange(i)}
              onChange={(next) => onUpdateSectionData(instrument.id, i, next)}
              ariaLabel={label}
            />
          );
        })}
      </fieldset>
    </div>
  );
}

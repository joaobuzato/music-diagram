import { useState } from "react";
import type { Instrument, Section, SectionData } from "./types";
import { SectionCell } from "./SectionCell";
import { EditableLabel } from "./EditableLabel";
import { tempoWidth } from "./utils/tempo";
import styles from "./MusicDiagram.module.css";

interface InstrumentRowProps {
  instrument: Instrument;
  sections: Section[];
  activeSection: number;
  onSectionChange: (index: number) => void;
  onUpdateSectionData: (
    instrumentId: string,
    sectionIndex: number,
    next: SectionData,
  ) => void;
  onUpdateInstrumentName: (instrumentId: string, name: string) => void;
  onRemoveInstrument: (instrumentId: string) => void;
}

function panLabel(pan: number): string {
  if (pan < -0.15) return "esquerda";
  if (pan > 0.15) return "direita";
  return "centro";
}

export function InstrumentRow({
  instrument,
  sections,
  activeSection,
  onSectionChange,
  onUpdateSectionData,
  onUpdateInstrumentName,
  onRemoveInstrument,
}: Readonly<InstrumentRowProps>) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  return (
    <div className={styles.instRow} aria-label={instrument.name}>
      {confirmingRemove ? (
        <fieldset
          className={styles.removeConfirmGroup}
          style={{ border: "none", padding: 0, margin: 0 }}
        >
          <legend className={styles.visuallyHidden}>
            {`Confirmar remoção de ${instrument.name}`}
          </legend>
          <button
            type="button"
            className={styles.removeConfirm}
            onClick={() => onRemoveInstrument(instrument.id)}
            autoFocus
          >
            Remover?
          </button>
          <button
            type="button"
            className={styles.removeCancel}
            onClick={() => setConfirmingRemove(false)}
            aria-label="Cancelar remoção"
            title="Cancelar"
          >
            ×
          </button>
        </fieldset>
      ) : (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={() => setConfirmingRemove(true)}
          aria-label={`Remover ${instrument.name}`}
          title={`Remover ${instrument.name}`}
        >
          ×
        </button>
      )}
      <EditableLabel
        value={instrument.name}
        onCommit={(next) => onUpdateInstrumentName(instrument.id, next)}
        ariaLabel="Nome do instrumento"
        className={styles.instName}
        inputClassName={styles.instNameInput}
        maxLength={32}
      />

      <div
        className={styles.instDot}
        aria-hidden="true"
        style={{ background: instrument.color }}
      />
      <fieldset
        className={styles.cellsTrack}
        style={{ border: "none", padding: 0, margin: 0 }}
      >
        <legend
          style={{ display: "none" }}
        >{`Seções de ${instrument.name}`}</legend>
        {sections.map((sec, i) => {
          const d = instrument.data[i];
          const label =
            d.dyn === 0
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

import { useState, type DragEvent } from "react";
import type { Instrument, Section, SectionData } from "./types";
import { SectionCell } from "./SectionCell";
import { EditableLabel } from "./EditableLabel";
import { DragHandle } from "./DragHandle";
import { tempoWidth } from "./utils/tempo";
import styles from "./MusicDiagram.module.css";

const INSTRUMENT_DND_TYPE = "application/x-md-instrument";

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
  onReorderInstrument: (fromId: string, toId: string) => void;
}

function panLabel(pan: number): string {
  if (pan < -0.15) return "esquerda";
  if (pan > 0.15) return "direita";
  return "centro";
}

function isInstrumentDrag(e: DragEvent<HTMLElement>): boolean {
  return Array.from(e.dataTransfer.types).includes(INSTRUMENT_DND_TYPE);
}

export function InstrumentRow({
  instrument,
  sections,
  activeSection,
  onSectionChange,
  onUpdateSectionData,
  onUpdateInstrumentName,
  onRemoveInstrument,
  onReorderInstrument,
}: Readonly<InstrumentRowProps>) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);

  function handleDragStart(e: DragEvent<HTMLButtonElement>) {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(INSTRUMENT_DND_TYPE, instrument.id);
    e.dataTransfer.setData("text/plain", instrument.name);
  }

  function handleDragEnd() {
    setIsDragging(false);
    setIsDropTarget(false);
  }

  function handleDragOver(e: DragEvent<HTMLFieldSetElement>) {
    if (!isInstrumentDrag(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!isDragging && !isDropTarget) setIsDropTarget(true);
  }

  function handleDragLeave(e: DragEvent<HTMLFieldSetElement>) {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setIsDropTarget(false);
  }

  function handleDrop(e: DragEvent<HTMLFieldSetElement>) {
    if (!isInstrumentDrag(e)) return;
    e.preventDefault();
    const fromId = e.dataTransfer.getData(INSTRUMENT_DND_TYPE);
    setIsDropTarget(false);
    if (!fromId || fromId === instrument.id) return;
    onReorderInstrument(fromId, instrument.id);
  }

  const rowClass = `${styles.instRow}${isDragging ? " " + styles.rowDragging : ""}${isDropTarget ? " " + styles.dropTarget : ""}`;

  return (
    <fieldset
      className={rowClass}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <legend className={styles.visuallyHidden}>{instrument.name}</legend>
      <DragHandle
        ariaLabel={`Mover ${instrument.name}`}
        title="Arraste para reordenar o instrumento"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
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
    </fieldset>
  );
}

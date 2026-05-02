import { useMemo } from "react";
import type { Instrument, Music, SectionData } from "./types";
import { TimelineHeader } from "./TimelineHeader";
import { GroupSection } from "./GroupSection";
import { PanRuler } from "./PanRuler";
import styles from "./MusicDiagram.module.css";

interface TimelinePanelProps {
  music: Music;
  activeSection: number;
  onSectionChange: (index: number) => void;
  onUpdateSectionData: (
    instrumentId: string,
    sectionIndex: number,
    next: SectionData,
  ) => void;
  onUpdateSectionTempo: (sectionIndex: number, tempo: string) => void;
  onUpdateSectionName: (sectionIndex: number, name: string) => void;
  onUpdateInstrumentName: (instrumentId: string, name: string) => void;
  onAddSection: (name: string, tempo: string) => void;
  onAddInstrument: () => void;
  onRemoveInstrument: (instrumentId: string) => void;
}

function groupInstruments(
  instruments: Instrument[],
): Array<[string, Instrument[]]> {
  const map = new Map<string, Instrument[]>();
  for (const inst of instruments) {
    const list = map.get(inst.group);
    if (list) list.push(inst);
    else map.set(inst.group, [inst]);
  }
  return Array.from(map.entries());
}

export function TimelinePanel({
  music,
  activeSection,
  onSectionChange,
  onUpdateSectionData,
  onUpdateSectionTempo,
  onUpdateSectionName,
  onUpdateInstrumentName,
  onAddSection,
  onAddInstrument,
  onRemoveInstrument,
}: Readonly<TimelinePanelProps>) {
  const groups = useMemo(
    () => groupInstruments(music.instruments),
    [music.instruments],
  );

  return (
    <div className={styles.timelinePanel}>
      <TimelineHeader
        sections={music.sections}
        activeSection={activeSection}
        onUpdateSectionTempo={onUpdateSectionTempo}
        onUpdateSectionName={onUpdateSectionName}
        onAddSection={onAddSection}
      />
      {groups.map(([label, instruments], i) => (
        <GroupSection
          key={label}
          label={label}
          instruments={instruments}
          sections={music.sections}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          onUpdateSectionData={onUpdateSectionData}
          onUpdateInstrumentName={onUpdateInstrumentName}
          onRemoveInstrument={onRemoveInstrument}
          isFirst={i === 0}
        />
      ))}
      <div className={styles.addInstrumentRow}>
        <button
          type="button"
          className={styles.addInstrumentBtn}
          onClick={onAddInstrument}
          aria-label="Adicionar novo instrumento (linha) com todas as seções mutadas"
        >
          <span aria-hidden="true">+</span> Adicionar instrumento
        </button>
      </div>
      <PanRuler sections={music.sections} />
    </div>
  );
}

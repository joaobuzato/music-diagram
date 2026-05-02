import { useState } from "react";
import type { Music, SectionData } from "./types";
import { DiagramHeader } from "./DiagramHeader";
import { SectionsBar } from "./SectionsBar";
import { TimelinePanel } from "./TimelinePanel";
import { StereoPanel } from "./StereoPanel";
import styles from "./MusicDiagram.module.css";

interface MusicDiagramProps {
  music: Music;
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

export function MusicDiagram({
  music,
  onUpdateSectionData,
  onUpdateSectionTempo,
  onUpdateSectionName,
  onUpdateInstrumentName,
  onAddSection,
  onAddInstrument,
  onRemoveInstrument,
}: Readonly<MusicDiagramProps>) {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className={styles.musicDiagram}>
      <DiagramHeader music={music} />
      <SectionsBar
        sections={music.sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onUpdateSectionName={onUpdateSectionName}
      />
      <main className={styles.main} aria-label="Diagrama de arranjo">
        <TimelinePanel
          music={music}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onUpdateSectionData={onUpdateSectionData}
          onUpdateSectionTempo={onUpdateSectionTempo}
          onUpdateSectionName={onUpdateSectionName}
          onUpdateInstrumentName={onUpdateInstrumentName}
          onAddSection={onAddSection}
          onAddInstrument={onAddInstrument}
          onRemoveInstrument={onRemoveInstrument}
        />
        <StereoPanel music={music} activeSection={activeSection} />
      </main>
    </div>
  );
}

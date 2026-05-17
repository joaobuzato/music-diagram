import { useCallback, useState } from "react";
import type { Music, SectionData } from "./types";
import { DiagramHeader } from "./DiagramHeader";
import { SectionsBar } from "./SectionsBar";
import { TimelinePanel } from "./TimelinePanel";
import { StereoPanel } from "./StereoPanel";
import styles from "./MusicDiagram.module.css";

interface MusicDiagramProps {
  music: Music;
  onBackToLibrary: () => void;
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
  onReorderSection: (from: number, to: number) => void;
  onReorderInstrument: (fromId: string, toId: string) => void;
}

function nextActive(active: number, from: number, to: number): number {
  if (from === to) return active;
  if (active === from) return to;
  if (from < to && active > from && active <= to) return active - 1;
  if (from > to && active >= to && active < from) return active + 1;
  return active;
}

export function MusicDiagram({
  music,
  onBackToLibrary,
  onUpdateSectionData,
  onUpdateSectionTempo,
  onUpdateSectionName,
  onUpdateInstrumentName,
  onAddSection,
  onAddInstrument,
  onRemoveInstrument,
  onReorderSection,
  onReorderInstrument,
}: Readonly<MusicDiagramProps>) {
  const [activeSection, setActiveSection] = useState(0);

  const handleReorderSection = useCallback(
    (from: number, to: number) => {
      onReorderSection(from, to);
      setActiveSection((prev) => nextActive(prev, from, to));
    },
    [onReorderSection],
  );

  return (
    <div className={styles.musicDiagram}>
      <DiagramHeader music={music} onBackToLibrary={onBackToLibrary} />
      <SectionsBar
        sections={music.sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onUpdateSectionName={onUpdateSectionName}
        onReorderSection={handleReorderSection}
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
          onReorderInstrument={onReorderInstrument}
        />
        <StereoPanel music={music} activeSection={activeSection} />
      </main>
    </div>
  );
}

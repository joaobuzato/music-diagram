import { useMemo } from 'react';
import type { Instrument, Music } from './types';
import { TimelineHeader } from './TimelineHeader';
import { GroupSection } from './GroupSection';
import { PanRuler } from './PanRuler';
import styles from './MusicDiagram.module.css';

interface TimelinePanelProps {
  music: Music;
  activeSection: number;
  onSectionChange: (index: number) => void;
}

function groupInstruments(instruments: Instrument[]): Array<[string, Instrument[]]> {
  const map = new Map<string, Instrument[]>();
  for (const inst of instruments) {
    const list = map.get(inst.group);
    if (list) list.push(inst);
    else map.set(inst.group, [inst]);
  }
  return Array.from(map.entries());
}

export function TimelinePanel({ music, activeSection, onSectionChange }: Readonly<TimelinePanelProps>) {
  const groups = useMemo(() => groupInstruments(music.instruments), [music.instruments]);

  return (
    <div className={styles.timelinePanel}>
      <TimelineHeader sections={music.sections} activeSection={activeSection} />
      {groups.map(([label, instruments], i) => (
        <GroupSection
          key={label}
          label={label}
          instruments={instruments}
          sections={music.sections}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isFirst={i === 0}
        />
      ))}
      <PanRuler count={music.sections.length} />
    </div>
  );
}

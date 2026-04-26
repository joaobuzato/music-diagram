import type { Music } from './types';
import { TimelineHeader } from './TimelineHeader';
import { GroupSection } from './GroupSection';
import { PanRuler } from './PanRuler';
import styles from './MusicDiagram.module.css';

interface TimelinePanelProps {
  music: Music;
  activeSection: number;
  onSectionChange: (index: number) => void;
}

export function TimelinePanel({ music, activeSection, onSectionChange }: Readonly<TimelinePanelProps>) {
  return (
    <div className={styles.timelinePanel}>
      <TimelineHeader sections={music.sections} activeSection={activeSection} />
      {music.groups.map((group, i) => (
        <GroupSection
          key={group.label}
          group={group}
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

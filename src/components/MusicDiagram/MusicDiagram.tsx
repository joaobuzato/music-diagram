import { useState } from 'react';
import type { Music } from './types';
import { DiagramHeader } from './DiagramHeader';
import { SectionsBar } from './SectionsBar';
import { TimelinePanel } from './TimelinePanel';
import { StereoPanel } from './StereoPanel';
import styles from './MusicDiagram.module.css';

interface MusicDiagramProps {
  music: Music;
}

export function MusicDiagram({ music }: Readonly<MusicDiagramProps>) {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className={styles.musicDiagram}>
      <DiagramHeader music={music} />
      <SectionsBar
        sections={music.sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className={styles.main}>
        <TimelinePanel
          music={music}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <StereoPanel music={music} activeSection={activeSection} />
      </div>
    </div>
  );
}

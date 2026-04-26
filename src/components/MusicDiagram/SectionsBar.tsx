import type { CSSProperties } from 'react';
import styles from './MusicDiagram.module.css';

const SECTION_COLORS = ['#D41E22', '#1B56E4', '#1AAF3C', '#D4A000'];

interface SectionsBarProps {
  sections: string[];
  activeSection: number;
  onSectionChange: (index: number) => void;
}

export function SectionsBar({ sections, activeSection, onSectionChange }: Readonly<SectionsBarProps>) {
  return (
    <div className={styles.sectionsBar}>
      {sections.map((sec, i) => (
        <div
          key={i}
          className={`${styles.stab}${i === activeSection ? ' ' + styles.active : ''}`}
          onClick={() => onSectionChange(i)}
          style={{ '--stab-color': SECTION_COLORS[i % SECTION_COLORS.length] } as CSSProperties}
        >
          {sec}
        </div>
      ))}
    </div>
  );
}

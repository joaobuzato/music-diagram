import styles from './MusicDiagram.module.css';

interface TimelineHeaderProps {
  sections: string[];
  activeSection: number;
}

export function TimelineHeader({ sections, activeSection }: Readonly<TimelineHeaderProps>) {
  return (
    <div className={styles.thRow}>
      {sections.map((s, i) => (
        <div
          key={i}
          className={`${styles.thCell}${i === activeSection ? ' ' + styles.active : ''}`}
        >
          {s}
        </div>
      ))}
    </div>
  );
}

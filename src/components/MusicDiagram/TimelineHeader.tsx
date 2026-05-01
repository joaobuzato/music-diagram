import { useEffect, useState } from 'react';
import type { Section } from './types';
import { tempoWidth } from './utils/tempo';
import styles from './MusicDiagram.module.css';

interface TimelineHeaderProps {
  sections: Section[];
  activeSection: number;
  onUpdateSectionTempo: (sectionIndex: number, tempo: string) => void;
}

interface TempoInputProps {
  value: string;
  onCommit: (next: string) => void;
}

function TempoInput({ value, onCommit }: Readonly<TempoInputProps>) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function commit() {
    const trimmed = draft.trim();
    if (!/^\d+\s*\/\s*\d+$/.test(trimmed)) {
      setDraft(value);
      return;
    }
    if (trimmed !== value) onCommit(trimmed);
  }

  return (
    <input
      className={styles.tempoInput}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          (e.currentTarget as HTMLInputElement).blur();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setDraft(value);
          (e.currentTarget as HTMLInputElement).blur();
        }
      }}
      onClick={(e) => e.stopPropagation()}
      aria-label="Tempo (fração)"
      inputMode="text"
      spellCheck={false}
    />
  );
}

export function TimelineHeader({ sections, activeSection, onUpdateSectionTempo }: Readonly<TimelineHeaderProps>) {
  return (
    <div className={styles.thRow}>
      {sections.map((s, i) => (
        <div
          key={i}
          className={`${styles.thCell}${i === activeSection ? ' ' + styles.active : ''}`}
          style={{ width: tempoWidth(s.tempo) }}
        >
          <span className={styles.thName}>{s.name}</span>
          <TempoInput
            value={s.tempo}
            onCommit={(next) => onUpdateSectionTempo(i, next)}
          />
        </div>
      ))}
    </div>
  );
}

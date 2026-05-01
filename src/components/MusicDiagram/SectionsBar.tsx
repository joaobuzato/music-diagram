import type { CSSProperties, KeyboardEvent } from 'react';
import type { Section } from './types';
import styles from './MusicDiagram.module.css';

const SECTION_COLORS = ['#D41E22', '#1B56E4', '#1AAF3C', '#D4A000'];

interface SectionsBarProps {
  sections: Section[];
  activeSection: number;
  onSectionChange: (index: number) => void;
}

export function SectionsBar({ sections, activeSection, onSectionChange }: Readonly<SectionsBarProps>) {
  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (i + 1) % sections.length;
      onSectionChange(next);
      (e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (i - 1 + sections.length) % sections.length;
      onSectionChange(prev);
      (e.currentTarget.parentElement?.children[prev] as HTMLElement)?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSectionChange(0);
      (e.currentTarget.parentElement?.children[0] as HTMLElement)?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = sections.length - 1;
      onSectionChange(last);
      (e.currentTarget.parentElement?.children[last] as HTMLElement)?.focus();
    }
  }

  return (
    <nav aria-label="Seções da música">
      <div className={styles.sectionsBar} role="tablist" aria-label="Seções">
        {sections.map((sec, i) => (
          <button
            key={`${sec.name}-${i}`}
            role="tab"
            aria-selected={i === activeSection}
            tabIndex={i === activeSection ? 0 : -1}
            className={`${styles.stab}${i === activeSection ? ' ' + styles.active : ''}`}
            onClick={() => onSectionChange(i)}
            onKeyDown={e => handleKeyDown(e, i)}
            style={{ '--stab-color': SECTION_COLORS[i % SECTION_COLORS.length] } as CSSProperties}
          >
            {sec.name}
          </button>
        ))}
      </div>
    </nav>
  );
}

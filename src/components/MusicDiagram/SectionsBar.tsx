import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import type { Section } from './types';
import styles from './MusicDiagram.module.css';

const SECTION_COLORS = ['#D41E22', '#1B56E4', '#1AAF3C', '#D4A000'];

function focusTabAt(parent: HTMLElement | null, idx: number) {
  const child = parent?.children[idx] as HTMLElement | undefined;
  child?.focus();
}

interface SectionsBarProps {
  sections: Section[];
  activeSection: number;
  onSectionChange: (index: number) => void;
  onUpdateSectionName: (sectionIndex: number, name: string) => void;
}

interface SectionTabProps {
  section: Section;
  index: number;
  total: number;
  active: boolean;
  editing: boolean;
  color: string;
  onSelect: () => void;
  onStartEdit: () => void;
  onCommit: (name: string) => void;
  onCancelEdit: () => void;
  onArrowNav: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

function SectionTab({
  section,
  index,
  total,
  active,
  editing,
  color,
  onSelect,
  onStartEdit,
  onCommit,
  onCancelEdit,
  onArrowNav,
}: Readonly<SectionTabProps>) {
  const [draft, setDraft] = useState(section.name);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!editing) setDraft(section.name);
  }, [editing, section.name]);

  useEffect(() => {
    if (editing) {
      const el = inputRef.current;
      if (el) {
        el.focus();
        el.select();
      }
    } else if (active) {
      // After exiting edit mode on the active tab, restore focus to the button.
      buttonRef.current?.focus({ preventScroll: true });
    }
  }, [editing, active]);

  function commit() {
    const trimmed = draft.trim();
    if (!trimmed) {
      onCancelEdit();
      return;
    }
    onCommit(trimmed);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className={`${styles.stab} ${styles.stabInput}${active ? ' ' + styles.active : ''}`}
        style={{ '--stab-color': color } as CSSProperties}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            onCancelEdit();
          }
          e.stopPropagation();
        }}
        aria-label={`Editar nome da seção ${index + 1} de ${total}`}
        maxLength={32}
        spellCheck={false}
        autoComplete="off"
      />
    );
  }

  return (
    <button
      ref={buttonRef}
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      className={`${styles.stab}${active ? ' ' + styles.active : ''}`}
      onClick={onSelect}
      onDoubleClick={onStartEdit}
      onKeyDown={(e) => {
        if (e.key === 'F2') {
          e.preventDefault();
          onStartEdit();
          return;
        }
        onArrowNav(e);
      }}
      style={{ '--stab-color': color } as CSSProperties}
      title="Clique duas vezes para editar o nome"
    >
      {section.name}
    </button>
  );
}

export function SectionsBar({ sections, activeSection, onSectionChange, onUpdateSectionName }: Readonly<SectionsBarProps>) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  function handleArrowNav(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const parent = e.currentTarget.parentElement;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (i + 1) % sections.length;
      onSectionChange(next);
      focusTabAt(parent, next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (i - 1 + sections.length) % sections.length;
      onSectionChange(prev);
      focusTabAt(parent, prev);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSectionChange(0);
      focusTabAt(parent, 0);
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = sections.length - 1;
      onSectionChange(last);
      focusTabAt(parent, last);
    }
  }

  return (
    <nav aria-label="Seções da música">
      <div className={styles.sectionsBar} role="tablist" aria-label="Seções">
        {sections.map((sec, i) => (
          <SectionTab
            key={`${sec.name}-${i}`}
            section={sec}
            index={i}
            total={sections.length}
            active={i === activeSection}
            editing={editingIdx === i}
            color={SECTION_COLORS[i % SECTION_COLORS.length]}
            onSelect={() => onSectionChange(i)}
            onStartEdit={() => setEditingIdx(i)}
            onCommit={(name) => {
              if (name !== sec.name) onUpdateSectionName(i, name);
              setEditingIdx(null);
            }}
            onCancelEdit={() => setEditingIdx(null)}
            onArrowNav={(e) => handleArrowNav(e, i)}
          />
        ))}
      </div>
    </nav>
  );
}

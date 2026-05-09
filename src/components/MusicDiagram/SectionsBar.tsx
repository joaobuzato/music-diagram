import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import type { Section } from './types';
import { DragHandle } from './DragHandle';
import styles from './MusicDiagram.module.css';

const SECTION_COLORS = ['#D41E22', '#1B56E4', '#1AAF3C', '#D4A000'];
const SECTION_DND_TYPE = 'application/x-md-section';

function focusTabAt(parent: HTMLElement | null, idx: number) {
  const wrapper = parent?.children[idx] as HTMLElement | undefined;
  const button = wrapper?.querySelector('[role="tab"]') as HTMLElement | null;
  (button ?? wrapper)?.focus();
}

interface SectionsBarProps {
  sections: Section[];
  activeSection: number;
  onSectionChange: (index: number) => void;
  onUpdateSectionName: (sectionIndex: number, name: string) => void;
  onReorderSection: (from: number, to: number) => void;
}

interface SectionTabProps {
  section: Section;
  index: number;
  total: number;
  active: boolean;
  editing: boolean;
  color: string;
  isDropTarget: boolean;
  onSelect: () => void;
  onStartEdit: () => void;
  onCommit: (name: string) => void;
  onCancelEdit: () => void;
  onArrowNav: (e: KeyboardEvent<HTMLButtonElement>) => void;
  onDragStartTab: (e: DragEvent<HTMLButtonElement>, index: number) => void;
  onDragEndTab: (e: DragEvent<HTMLButtonElement>) => void;
  onDragOverTab: (e: DragEvent<HTMLFieldSetElement>, index: number) => void;
  onDragLeaveTab: (e: DragEvent<HTMLFieldSetElement>, index: number) => void;
  onDropTab: (e: DragEvent<HTMLFieldSetElement>, index: number) => void;
}

function SectionTab({
  section,
  index,
  total,
  active,
  editing,
  color,
  isDropTarget,
  onSelect,
  onStartEdit,
  onCommit,
  onCancelEdit,
  onArrowNav,
  onDragStartTab,
  onDragEndTab,
  onDragOverTab,
  onDragLeaveTab,
  onDropTab,
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
      <fieldset className={styles.stabWrap}>
        <legend className={styles.visuallyHidden}>{`Editar seção ${index + 1}`}</legend>
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
      </fieldset>
    );
  }

  return (
    <fieldset
      className={`${styles.stabWrap}${isDropTarget ? ' ' + styles.dropTarget : ''}`}
      onDragOver={(e) => onDragOverTab(e, index)}
      onDragLeave={(e) => onDragLeaveTab(e, index)}
      onDrop={(e) => onDropTab(e, index)}
    >
      <legend className={styles.visuallyHidden}>{`Seção ${section.name}`}</legend>
      <DragHandle
        orientation="horizontal"
        ariaLabel={`Mover seção ${section.name}`}
        title="Arraste para reordenar a seção"
        onDragStart={(e) => onDragStartTab(e, index)}
        onDragEnd={onDragEndTab}
        style={{ '--stab-color': color } as CSSProperties}
      />
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
    </fieldset>
  );
}

export function SectionsBar({
  sections,
  activeSection,
  onSectionChange,
  onUpdateSectionName,
  onReorderSection,
}: Readonly<SectionsBarProps>) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [dragFromIdx, setDragFromIdx] = useState<number | null>(null);
  const [dropTargetIdx, setDropTargetIdx] = useState<number | null>(null);

  function handleArrowNav(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const parent = e.currentTarget.closest(`.${styles.sectionsBar}`) as HTMLElement | null;
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

  function handleDragStart(e: DragEvent<HTMLButtonElement>, i: number) {
    setDragFromIdx(i);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(SECTION_DND_TYPE, String(i));
    e.dataTransfer.setData('text/plain', sections[i]?.name ?? '');
  }

  function handleDragEnd() {
    setDragFromIdx(null);
    setDropTargetIdx(null);
  }

  function isSectionDrag(e: DragEvent<HTMLElement>): boolean {
    return (
      dragFromIdx !== null ||
      Array.from(e.dataTransfer.types).includes(SECTION_DND_TYPE)
    );
  }

  function handleDragOver(e: DragEvent<HTMLFieldSetElement>, i: number) {
    if (!isSectionDrag(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetIdx !== i) setDropTargetIdx(i);
  }

  function handleDragLeave(e: DragEvent<HTMLFieldSetElement>, i: number) {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setDropTargetIdx((prev) => (prev === i ? null : prev));
  }

  function handleDrop(e: DragEvent<HTMLFieldSetElement>, i: number) {
    if (!isSectionDrag(e)) return;
    e.preventDefault();
    const raw = e.dataTransfer.getData(SECTION_DND_TYPE);
    const from = raw ? Number.parseInt(raw, 10) : dragFromIdx;
    setDragFromIdx(null);
    setDropTargetIdx(null);
    if (from === null || Number.isNaN(from) || from === i) return;
    onReorderSection(from, i);
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
            isDropTarget={dropTargetIdx === i && dragFromIdx !== i}
            onSelect={() => onSectionChange(i)}
            onStartEdit={() => setEditingIdx(i)}
            onCommit={(name) => {
              if (name !== sec.name) onUpdateSectionName(i, name);
              setEditingIdx(null);
            }}
            onCancelEdit={() => setEditingIdx(null)}
            onArrowNav={(e) => handleArrowNav(e, i)}
            onDragStartTab={handleDragStart}
            onDragEndTab={handleDragEnd}
            onDragOverTab={handleDragOver}
            onDragLeaveTab={handleDragLeave}
            onDropTab={handleDrop}
          />
        ))}
      </div>
    </nav>
  );
}

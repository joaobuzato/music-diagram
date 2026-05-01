import { useEffect, useId, useRef, useState } from 'react';
import type { Section } from './types';
import { DEFAULT_TEMPO, tempoWidth } from './utils/tempo';
import { EditableLabel } from './EditableLabel';
import styles from './MusicDiagram.module.css';

const TEMPO_PATTERN = /^\d+\s*\/\s*\d+$/;

interface TimelineHeaderProps {
  sections: Section[];
  activeSection: number;
  onUpdateSectionTempo: (sectionIndex: number, tempo: string) => void;
  onUpdateSectionName: (sectionIndex: number, name: string) => void;
  onAddSection: (name: string, tempo: string) => void;
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

interface AddSectionControlProps {
  onAdd: (name: string, tempo: string) => void;
}

function AddSectionControl({ onAdd }: Readonly<AddSectionControlProps>) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [tempo, setTempo] = useState(DEFAULT_TEMPO);
  const [error, setError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const formId = useId();

  useEffect(() => {
    if (open) nameInputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        reset();
        setOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function reset() {
    setName('');
    setTempo(DEFAULT_TEMPO);
    setError(null);
  }

  function close() {
    reset();
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function commit() {
    const trimmedName = name.trim();
    const trimmedTempo = tempo.trim();
    if (!trimmedName) {
      setError('Informe o nome da seção');
      nameInputRef.current?.focus();
      return;
    }
    if (!TEMPO_PATTERN.test(trimmedTempo)) {
      setError('Tempo inválido. Use o formato N/N (ex.: 4/4)');
      return;
    }
    onAdd(trimmedName, trimmedTempo);
    close();
  }

  if (!open) {
    return (
      <button
        ref={triggerRef}
        type="button"
        className={styles.addSectionTrigger}
        onClick={() => setOpen(true)}
        aria-label="Adicionar nova seção (coluna)"
        aria-expanded={false}
        aria-controls={formId}
      >
        <span aria-hidden="true">+</span>
        <span className={styles.addSectionTriggerLabel}>Seção</span>
      </button>
    );
  }

  return (
    <form
      id={formId}
      className={styles.addSectionForm}
      aria-label="Nova seção"
      onSubmit={(e) => {
        e.preventDefault();
        commit();
      }}
    >
      <fieldset className={styles.addSectionFieldset}>
        <legend className={styles.visuallyHidden}>Nova seção</legend>
        <div className={styles.addSectionField}>
          <label htmlFor={`${formId}-name`} className={styles.addSectionLabel}>
            Nome
          </label>
          <input
            id={`${formId}-name`}
            ref={nameInputRef}
            className={styles.addSectionInput}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={!!error && !name.trim()}
            aria-describedby={error ? `${formId}-error` : undefined}
            maxLength={32}
            spellCheck={false}
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.addSectionField}>
          <label htmlFor={`${formId}-tempo`} className={styles.addSectionLabel}>
            Tempo
          </label>
          <input
            id={`${formId}-tempo`}
            className={`${styles.addSectionInput} ${styles.addSectionTempo}`}
            value={tempo}
            onChange={(e) => {
              setTempo(e.target.value);
              if (error) setError(null);
            }}
            inputMode="text"
            spellCheck={false}
            autoComplete="off"
            placeholder="4/4"
            required
          />
        </div>
      </fieldset>
      {error && (
        <span id={`${formId}-error`} className={styles.addSectionError} role="alert">
          {error}
        </span>
      )}
      <div className={styles.addSectionActions}>
        <button
          type="submit"
          className={styles.addSectionConfirm}
          aria-label="Confirmar adição da seção"
        >
          Adicionar
        </button>
        <button
          type="button"
          className={styles.addSectionCancel}
          onClick={close}
          aria-label="Cancelar adição da seção (Esc)"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function TimelineHeader({ sections, activeSection, onUpdateSectionTempo, onUpdateSectionName, onAddSection }: Readonly<TimelineHeaderProps>) {
  return (
    <div className={styles.thRow}>
      {sections.map((s, i) => (
        <div
          key={`${s.name}-${i}`}
          className={`${styles.thCell}${i === activeSection ? ' ' + styles.active : ''}`}
          style={{ width: tempoWidth(s.tempo) }}
        >
          <EditableLabel
            value={s.name}
            onCommit={(next) => onUpdateSectionName(i, next)}
            ariaLabel={`Nome da seção ${i + 1}`}
            className={styles.thName}
            inputClassName={styles.thNameInput}
            maxLength={32}
          />
          <TempoInput
            value={s.tempo}
            onCommit={(next) => onUpdateSectionTempo(i, next)}
          />
        </div>
      ))}
      <AddSectionControl onAdd={onAddSection} />
    </div>
  );
}

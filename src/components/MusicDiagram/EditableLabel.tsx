import { useEffect, useRef, useState } from 'react';

interface EditableLabelProps {
  value: string;
  onCommit: (next: string) => void;
  ariaLabel: string;
  className?: string;
  inputClassName?: string;
  maxLength?: number;
}

export function EditableLabel({
  value,
  onCommit,
  ariaLabel,
  className,
  inputClassName,
  maxLength = 64,
}: Readonly<EditableLabelProps>) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing) {
      const el = inputRef.current;
      if (el) {
        el.focus();
        el.select();
      }
    }
  }, [editing]);

  function startEdit() {
    setDraft(value);
    setEditing(true);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
    requestAnimationFrame(() => labelRef.current?.focus());
  }

  function commit() {
    const trimmed = draft.trim();
    if (!trimmed) {
      cancel();
      return;
    }
    if (trimmed !== value) onCommit(trimmed);
    setEditing(false);
    requestAnimationFrame(() => labelRef.current?.focus());
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className={inputClassName}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
          }
          e.stopPropagation();
        }}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        aria-label={ariaLabel}
        maxLength={maxLength}
        spellCheck={false}
        autoComplete="off"
      />
    );
  }

  return (
    <span
      ref={labelRef}
      className={className}
      role="button"
      tabIndex={0}
      aria-label={`${ariaLabel}: ${value}. Pressione Enter ou clique duas vezes para editar.`}
      title="Clique duas vezes para editar"
      onDoubleClick={(e) => {
        e.stopPropagation();
        startEdit();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'F2') {
          e.preventDefault();
          startEdit();
        }
      }}
    >
      {value}
    </span>
  );
}

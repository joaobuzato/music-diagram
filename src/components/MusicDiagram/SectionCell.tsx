import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SectionData } from "./types";
import styles from "./MusicDiagram.module.css";

interface SectionCellProps {
  data: SectionData;
  color: string;
  isActive: boolean;
  width: number;
  onClick: () => void;
  onChange: (next: SectionData) => void;
  ariaLabel: string;
}

const MUTE_THRESHOLD = 0.05;
const UNMUTE_DEFAULT_DYN = 0.5;

function clamp01(v: number): number {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

export function SectionCell({
  data,
  color,
  isActive,
  width,
  onClick,
  onChange,
  ariaLabel,
}: Readonly<SectionCellProps>) {
  const cellRef = useRef<HTMLButtonElement>(null);
  const [dragging, setDragging] = useState(false);

  const muted = data.dyn === 0;
  const pct = (((data.pan + 1) / 2) * 100).toFixed(1) + "%";
  const dynPct = data.dyn * 100 + "%";

  function computeFromPointer(e: ReactPointerEvent): SectionData | null {
    const cell = cellRef.current;
    if (!cell) return null;
    const rect = cell.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const x = clamp01((e.clientX - rect.left) / rect.width);
    const y = clamp01((e.clientY - rect.top) / rect.height);
    const pan = x * 2 - 1;
    let dyn = 1 - y;
    if (dyn <= MUTE_THRESHOLD) dyn = 0;
    return { ...data, pan, dyn };
  }

  function handleDotPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    cellRef.current?.setPointerCapture(e.pointerId);
    setDragging(true);
  }

  function handleCellPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging) return;
    const next = computeFromPointer(e);
    if (next) onChange(next);
  }

  function endDrag(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging) return;
    cellRef.current?.releasePointerCapture(e.pointerId);
    setDragging(false);
  }

  return (
    <button
      ref={cellRef}
      type="button"
      className={`${styles.icell}${isActive ? " " + styles.acol : ""}${muted ? "" : " " + styles.hasC}`}
      style={{ width }}
      onClick={onClick}
      onDoubleClick={
        muted ? () => onChange({ ...data, dyn: UNMUTE_DEFAULT_DYN }) : undefined
      }
      onPointerMove={handleCellPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      aria-label={ariaLabel}
      aria-pressed={isActive}
    >
      {muted ? (
        <div className={styles.muteDash} aria-hidden="true">
          —
        </div>
      ) : (
        <>
          <div
            className={styles.dynBar}
            aria-hidden="true"
            style={{
              height: dynPct,
              background: `linear-gradient(to top, ${color}cc, ${color}bb)`,
            }}
          />
          <div
            className={styles.panVline}
            aria-hidden="true"
            style={{ left: pct, height: dynPct }}
          />
          <div
            className={styles.panDot}
            aria-hidden="true"
            style={{
              left: pct,
              bottom: dynPct,
              cursor: "grab",
              touchAction: "none",
            }}
            onPointerDown={handleDotPointerDown}
            onClick={(e) => e.stopPropagation()}
          />
          <div className={styles.dynLabel} aria-hidden="true">
            {Math.round(data.dyn * 100)}%
          </div>
        </>
      )}
    </button>
  );
}

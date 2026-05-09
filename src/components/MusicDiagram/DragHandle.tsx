import type { CSSProperties, DragEvent } from "react";
import styles from "./MusicDiagram.module.css";

interface DragHandleProps {
  onDragStart: (e: DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: (e: DragEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  title?: string;
  orientation?: "vertical" | "horizontal";
  style?: CSSProperties;
}

export function DragHandle({
  onDragStart,
  onDragEnd,
  ariaLabel,
  title,
  orientation = "vertical",
  style,
}: Readonly<DragHandleProps>) {
  return (
    <button
      type="button"
      draggable
      className={`${styles.dragHandle}${orientation === "horizontal" ? " " + styles.dragHandleH : ""}`}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={(e) => e.stopPropagation()}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
      style={style}
    >
      <svg
        viewBox="0 0 8 12"
        width={orientation === "horizontal" ? 12 : 8}
        height={orientation === "horizontal" ? 8 : 12}
        aria-hidden="true"
        style={
          orientation === "horizontal" ? { transform: "rotate(90deg)" } : undefined
        }
      >
        <circle cx="2" cy="2" r="1" fill="currentColor" />
        <circle cx="6" cy="2" r="1" fill="currentColor" />
        <circle cx="2" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="2" cy="10" r="1" fill="currentColor" />
        <circle cx="6" cy="10" r="1" fill="currentColor" />
      </svg>
    </button>
  );
}

import type { RegularSectionData } from "./types";
import styles from "./MusicDiagram.module.css";

interface SectionCellProps {
  data: RegularSectionData;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

export function SectionCell({
  data,
  color,
  isActive,
  onClick,
}: Readonly<SectionCellProps>) {
  const muted = data.dyn === 0;
  const pct = (((data.pan + 1) / 2) * 100).toFixed(1) + "%";
  // -1 (L) → -135°, 0 (C) → 0°, +1 (R) → +135°
  const knobAngle = data.pan * 135;

  return (
    <div
      className={`${styles.icell}${isActive ? " " + styles.acol : ""}${!muted ? " " + styles.hasC : ""}`}
      onClick={onClick}
    >
      {muted ? (
        <div className={styles.muteDash}>—</div>
      ) : (
        <>
          <div
            className={styles.dynBar}
            style={{
              height: data.dyn * 100 + "%",
              background: `linear-gradient(to top, ${color}cc, ${color}bb)`,
            }}
          />
          <div
            className={styles.panKnob}
            style={{
              left: pct,
              background: color,
              transform: `translate(-50%, -50%) rotate(${knobAngle}deg)`,
            }}
          >
            <div className={styles.panKnobIndicator} />
          </div>
          <div className={styles.dynLabel}>{Math.round(data.dyn * 100)}%</div>
        </>
      )}
    </div>
  );
}

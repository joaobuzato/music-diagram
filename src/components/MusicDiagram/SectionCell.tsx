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
            className={styles.panVline}
            style={{ left: pct, background: color }}
          />
          <div
            className={styles.panDot}
            style={{
              left: pct,
              background: color,
              boxShadow: `0 0 5px ${color}`,
            }}
          />
          <div className={styles.dynLabel}>{Math.round(data.dyn * 100)}%</div>
        </>
      )}
    </div>
  );
}

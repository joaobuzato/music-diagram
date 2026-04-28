import type { SectionData } from "./types";
import styles from "./MusicDiagram.module.css";

interface SectionCellProps {
  data: SectionData;
  color: string;
  isActive: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export function SectionCell({
  data,
  color,
  isActive,
  onClick,
  ariaLabel,
}: Readonly<SectionCellProps>) {
  const muted = data.dyn === 0;
  const pct = (((data.pan + 1) / 2) * 100).toFixed(1) + "%";
  const dynPct = data.dyn * 100 + "%";

  return (
    <button
      type="button"
      className={`${styles.icell}${isActive ? " " + styles.acol : ""}${muted ? "" : " " + styles.hasC}`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isActive}
    >
      {muted ? (
        <div className={styles.muteDash} aria-hidden="true">—</div>
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
            style={{ left: pct, bottom: dynPct }}
          />
          <div className={styles.dynLabel} aria-hidden="true">
            {Math.round(data.dyn * 100)}%
          </div>
        </>
      )}
    </button>
  );
}

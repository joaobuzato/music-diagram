import { useState } from "react";
import type { Music } from "./types";
import styles from "./MusicDiagram.module.css";

interface MusicLibraryProps {
  library: Record<string, Music>;
  onOpen: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export function MusicLibrary({
  library,
  onOpen,
  onCreate,
  onDelete,
}: Readonly<MusicLibraryProps>) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const entries = Object.values(library);

  return (
    <div className={styles.libraryPage}>
      <header className={styles.libraryHeader} aria-label="Biblioteca de músicas">
        <div className={styles.logo} aria-hidden="true">◈ BIBLIOTECA</div>
        <div className={styles.libraryHeaderActions}>
          <button
            type="button"
            className={styles.addInstrumentBtn}
            onClick={onCreate}
          >
            + Nova música
          </button>
        </div>
      </header>

      <section className={styles.libraryBody} aria-label="Músicas salvas">
        {entries.length === 0 ? (
          <p className={styles.libraryEmpty}>
            Nenhuma música salva ainda. Clique em "Nova música" para começar.
          </p>
        ) : (
          <ul className={styles.libraryGrid}>
            {entries.map((music) => {
              const isConfirming = confirmId === music.id;
              const sectionsCount = music.sections.length;
              const instrumentsCount = music.instruments.length;
              return (
                <li key={music.id} className={styles.musicCard}>
                  <button
                    type="button"
                    className={styles.musicCardBody}
                    onClick={() => onOpen(music.id)}
                    aria-label={`Abrir ${music.title || "música sem título"}`}
                  >
                    <span className={styles.musicCardTitle}>
                      {music.title || "Sem título"}
                    </span>
                    <span className={styles.musicCardArtist}>
                      {music.artist || "—"}
                    </span>
                    <span className={styles.musicCardMeta}>
                      <span>{music.key || "—"}</span>
                      <span>{music.bpm} BPM</span>
                      <span>{sectionsCount} seç.</span>
                      <span>{instrumentsCount} instr.</span>
                    </span>
                    <span className={styles.musicCardId}>{music.id}</span>
                  </button>
                  <div className={styles.musicCardActions}>
                    {isConfirming ? (
                      <div className={styles.removeConfirmGroup}>
                        <button
                          type="button"
                          className={styles.removeConfirm}
                          onClick={() => {
                            onDelete(music.id);
                            setConfirmId(null);
                          }}
                        >
                          Remover
                        </button>
                        <button
                          type="button"
                          className={styles.removeCancel}
                          onClick={() => setConfirmId(null)}
                          aria-label="Cancelar"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => setConfirmId(music.id)}
                        aria-label={`Remover ${music.title || "música"}`}
                        title="Remover"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

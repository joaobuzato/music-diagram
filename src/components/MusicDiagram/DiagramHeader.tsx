import { useState } from 'react';
import type { Music } from './types';
import styles from './MusicDiagram.module.css';

interface DiagramHeaderProps {
  music: Music;
}

export function DiagramHeader({ music }: Readonly<DiagramHeaderProps>) {
  const [title, setTitle] = useState(music.title);
  const [artist, setArtist] = useState(music.artist);
  const [bpm, setBpm] = useState(String(music.bpm));
  const [key, setKey] = useState(music.key);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>◈ ARRANJO</div>
      <div className={styles.songMeta}>
        <div className={styles.mf}>
          <span className={styles.ml}>Música</span>
          <input
            className={styles.mv}
            style={{ width: 130 }}
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.mf}>
          <span className={styles.ml}>Artista</span>
          <input
            className={styles.mv}
            style={{ width: 110 }}
            value={artist}
            onChange={e => setArtist(e.target.value)}
          />
        </div>
        <div className={styles.mf}>
          <span className={styles.ml}>BPM</span>
          <input
            className={styles.mv}
            style={{ width: 44 }}
            value={bpm}
            onChange={e => setBpm(e.target.value)}
          />
        </div>
        <div className={styles.mf}>
          <span className={styles.ml}>Tom</span>
          <input
            className={styles.mv}
            style={{ width: 66 }}
            value={key}
            onChange={e => setKey(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.hint}>CLIQUE EM UMA SEÇÃO PARA ATUALIZAR O CAMPO ESTÉREO →</div>
    </header>
  );
}

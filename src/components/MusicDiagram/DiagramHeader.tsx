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
    <header className={styles.header} aria-label="Informações da música">
      <div className={styles.logo} aria-hidden="true">◈ ARRANJO</div>
      <fieldset className={styles.songMeta} style={{ border: 'none', margin: 0, padding: 0 }}>
        <legend className={styles.ml} style={{ display: 'none' }}>Metadados da música</legend>
        <div className={styles.mf}>
          <label htmlFor="meta-title" className={styles.ml}>Música</label>
          <input
            id="meta-title"
            className={styles.mv}
            style={{ width: 130 }}
            value={title}
            onChange={e => setTitle(e.target.value)}
            aria-label="Título da música"
          />
        </div>
        <div className={styles.mf}>
          <label htmlFor="meta-artist" className={styles.ml}>Artista</label>
          <input
            id="meta-artist"
            className={styles.mv}
            style={{ width: 110 }}
            value={artist}
            onChange={e => setArtist(e.target.value)}
            aria-label="Nome do artista"
          />
        </div>
        <div className={styles.mf}>
          <label htmlFor="meta-bpm" className={styles.ml}>BPM</label>
          <input
            id="meta-bpm"
            className={styles.mv}
            style={{ width: 44 }}
            value={bpm}
            onChange={e => setBpm(e.target.value)}
            aria-label="Batidas por minuto"
            inputMode="numeric"
          />
        </div>
        <div className={styles.mf}>
          <label htmlFor="meta-key" className={styles.ml}>Tom</label>
          <input
            id="meta-key"
            className={styles.mv}
            style={{ width: 66 }}
            value={key}
            onChange={e => setKey(e.target.value)}
            aria-label="Tonalidade"
          />
        </div>
      </fieldset>
      <div className={styles.hint} aria-hidden="true">
        CLIQUE EM UMA SEÇÃO PARA ATUALIZAR O CAMPO ESTÉREO →
      </div>
    </header>
  );
}

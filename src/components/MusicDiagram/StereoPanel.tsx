import type { Music } from './types';
import { StereoCanvas } from './StereoCanvas';
import { FreqLegend } from './FreqLegend';
import styles from './MusicDiagram.module.css';

interface StereoPanelProps {
  music: Music;
  activeSection: number;
}

export function StereoPanel({ music, activeSection }: Readonly<StereoPanelProps>) {
  const sectionName = music.sections[activeSection]?.name ?? '';

  return (
    <aside className={styles.stereoPanel} aria-label="Campo estéreo">
      <div className={styles.ptitle} aria-hidden="true">Campo Estéreo · Art of Mixing</div>
      <div className={styles.secLabelBig} aria-live="polite" aria-atomic="true">
        {sectionName.toUpperCase()}
      </div>
      <StereoCanvas instruments={music.instruments} activeSection={activeSection} sectionName={sectionName} />
      <div className={styles.stereoLr} aria-hidden="true">
        <span>◄ ESQUERDA</span>
        <span>DIREITA ►</span>
      </div>
      <div className={styles.stereoDept} aria-hidden="true">
        <span>▲ próximo</span>
        <span>distante ▼</span>
      </div>
      <div className={styles.tipBlock}>
        <strong>Leitura:</strong><br />
        — Horizontal = panorâmica (L / R)<br />
        — Vertical = proeminência na mix<br />
        — Tamanho = dinâmica<br />
        — Cor = faixa de frequência
      </div>
      <div className={styles.tipBlock}>
        <div className={styles.ptitle} style={{ marginBottom: 6 }}>Frequências</div>
        <FreqLegend />
      </div>
    </aside>
  );
}

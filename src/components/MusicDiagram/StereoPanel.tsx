import type { Music } from './types';
import { StereoCanvas } from './StereoCanvas';
import { FreqLegend } from './FreqLegend';
import styles from './MusicDiagram.module.css';

interface StereoPanelProps {
  music: Music;
  activeSection: number;
}

export function StereoPanel({ music, activeSection }: Readonly<StereoPanelProps>) {
  return (
    <div className={styles.stereoPanel}>
      <div className={styles.ptitle}>Campo Estéreo · Art of Mixing</div>
      <div className={styles.secLabelBig}>
        {music.sections[activeSection].toUpperCase()}
      </div>
      <StereoCanvas groups={music.groups} activeSection={activeSection} />
      <div className={styles.stereoLr}>
        <span>◄ ESQUERDA</span>
        <span>DIREITA ►</span>
      </div>
      <div className={styles.stereoDept}>
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
    </div>
  );
}

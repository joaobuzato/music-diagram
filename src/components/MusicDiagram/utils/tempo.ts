import { CELL_WIDTH } from '../constants';

export const DEFAULT_TEMPO = '4/4';

export function parseTempo(tempo: string): number {
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(tempo);
  if (!m) return 1;
  const num = Number(m[1]);
  const den = Number(m[2]);
  if (!num || !den) return 1;
  return num / den;
}

export function tempoWidth(tempo: string): number {
  return Math.max(28, Math.round(CELL_WIDTH * parseTempo(tempo)));
}

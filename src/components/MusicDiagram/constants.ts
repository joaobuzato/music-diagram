import type { FreqBand } from './types';

export const FREQ_COLORS: Record<FreqBand, string> = {
  'sub':      '#D41E22',
  'low-mid':  '#D4A000',
  'high-mid': '#1B56E4',
  'high':     '#8B1ED4',
  'vocal':    '#1AAF3C',
};

export const CELL_WIDTH        = 140;
export const CELL_HEIGHT       = 64;
export const CELL_GAP          = 3;
export const INST_LABEL_WIDTH  = 118;

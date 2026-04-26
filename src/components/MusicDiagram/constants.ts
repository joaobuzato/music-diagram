import type { FreqBand } from './types';

export const FREQ_COLORS: Record<FreqBand, string> = {
  'sub':      '#D41E22',
  'low-mid':  '#D4A000',
  'high-mid': '#1B56E4',
  'high':     '#8B1ED4',
  'vocal':    '#1AAF3C',
};

export const CELL_WIDTH        = 72;
export const CELL_HEIGHT       = 30;
export const CELL_GAP          = 2;
export const VOCAL_CURVE_H     = 40;
export const INST_LABEL_WIDTH  = 118;

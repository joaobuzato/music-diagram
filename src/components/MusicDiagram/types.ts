export type FreqBand = 'sub' | 'low-mid' | 'high-mid' | 'high' | 'vocal';

export interface SectionData {
  pan: number;
  dyn: number;
  prom: number;
}

export interface Instrument {
  id: string;
  name: string;
  color: string;
  freq: FreqBand;
  group: string;
  data: SectionData[];
}

export interface Music {
  title: string;
  artist: string;
  bpm: number;
  key: string;
  sections: string[];
  instruments: Instrument[];
}

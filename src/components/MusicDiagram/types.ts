export type FreqBand = 'sub' | 'low-mid' | 'high-mid' | 'high' | 'vocal';

export interface RegularSectionData {
  pan: number;
  dyn: number;
  prom: number;
}

export interface VocalSectionData {
  pan: number;
  dyn: number;
  intensity: number;
}

export interface RegularInstrument {
  id: string;
  name: string;
  color: string;
  freq: FreqBand;
  isVocal?: false;
  data: RegularSectionData[];
}

export interface VocalInstrument {
  id: string;
  name: string;
  color: string;
  freq: FreqBand;
  isVocal: true;
  data: VocalSectionData[];
}

export type Instrument = RegularInstrument | VocalInstrument;

export interface InstrumentGroup {
  label: string;
  instruments: Instrument[];
}

export interface Music {
  title: string;
  artist: string;
  bpm: number;
  key: string;
  sections: string[];
  groups: InstrumentGroup[];
}

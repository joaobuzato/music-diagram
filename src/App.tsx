import { useCallback, useState } from 'react';
import { MusicDiagram } from './components/MusicDiagram/MusicDiagram';
import type { Instrument, Music, Section, SectionData } from './components/MusicDiagram/types';
import { DEFAULT_TEMPO } from './components/MusicDiagram/utils/tempo';
import sampleMusic from './data/sampleMusic.json';

const STORAGE_KEY = 'music-diagram-data-v2';

function normalizeSections(raw: unknown): Section[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s) => {
    if (typeof s === 'string') return { name: s, tempo: DEFAULT_TEMPO };
    const obj = s as Partial<Section>;
    return {
      name: typeof obj.name === 'string' ? obj.name : '',
      tempo: typeof obj.tempo === 'string' && obj.tempo ? obj.tempo : DEFAULT_TEMPO,
    };
  });
}

function loadMusic(): Music {
  const stored = localStorage.getItem(STORAGE_KEY);
  const raw = stored ? JSON.parse(stored) : sampleMusic;
  const music: Music = {
    ...(raw as Music),
    sections: normalizeSections((raw as { sections: unknown }).sections),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(music));
  return music;
}

function replaceAt<T>(arr: T[], index: number, value: T): T[] {
  const out = arr.slice();
  out[index] = value;
  return out;
}

function withUpdatedInstrument(
  instruments: Instrument[],
  instrumentId: string,
  sectionIndex: number,
  next: SectionData,
): Instrument[] {
  return instruments.map((inst) =>
    inst.id === instrumentId
      ? { ...inst, data: replaceAt(inst.data, sectionIndex, next) }
      : inst,
  );
}

function App() {
  const [music, setMusic] = useState<Music>(loadMusic);

  const updateSectionData = useCallback(
    (instrumentId: string, sectionIndex: number, next: SectionData) => {
      setMusic((prev) => {
        const updated: Music = {
          ...prev,
          instruments: withUpdatedInstrument(prev.instruments, instrumentId, sectionIndex, next),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const updateSectionTempo = useCallback(
    (sectionIndex: number, tempo: string) => {
      setMusic((prev) => {
        const section = prev.sections[sectionIndex];
        if (!section) return prev;
        const updated: Music = {
          ...prev,
          sections: replaceAt(prev.sections, sectionIndex, { ...section, tempo }),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  return (
    <MusicDiagram
      music={music}
      onUpdateSectionData={updateSectionData}
      onUpdateSectionTempo={updateSectionTempo}
    />
  );
}

export default App;

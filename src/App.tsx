import { useCallback, useState } from "react";
import { MusicDiagram } from "./components/MusicDiagram/MusicDiagram";
import type {
  Instrument,
  Music,
  Section,
  SectionData,
} from "./components/MusicDiagram/types";
import { DEFAULT_TEMPO } from "./components/MusicDiagram/utils/tempo";
import sampleMusic from "./data/sampleMusic.json";

const MUTED_CELL: SectionData = { pan: 0, dyn: 0, prom: 0 };
const NEW_INSTRUMENT_GROUP = "Outros";
const SAFE_INSTRUMENT_COLORS = [
  "#ff6035",
  "#ffa040",
  "#ffe082",
  "#fff176",
  "#ea4c89",
  "#66bb6a",
  "#26c6da",
  "#ab47bc",
  "#00e676",
  "#80cbc4",
  "#5c6bc0",
  "#ef5350",
  "#26a69a",
  "#d4a373",
];

function pickRandomColor(): string {
  return SAFE_INSTRUMENT_COLORS[
    Math.floor(Math.random() * SAFE_INSTRUMENT_COLORS.length)
  ];
}

const STORAGE_KEY = "music-diagram-data-v2";

function normalizeSections(raw: unknown): Section[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s) => {
    if (typeof s === "string") return { name: s, tempo: DEFAULT_TEMPO };
    const obj = s as Partial<Section>;
    return {
      name: typeof obj.name === "string" ? obj.name : "",
      tempo:
        typeof obj.tempo === "string" && obj.tempo ? obj.tempo : DEFAULT_TEMPO,
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
          instruments: withUpdatedInstrument(
            prev.instruments,
            instrumentId,
            sectionIndex,
            next,
          ),
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
          sections: replaceAt(prev.sections, sectionIndex, {
            ...section,
            tempo,
          }),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const addSection = useCallback((name: string, tempo: string) => {
    setMusic((prev) => {
      const newSection: Section = { name, tempo };
      const updated: Music = {
        ...prev,
        sections: [...prev.sections, newSection],
        instruments: prev.instruments.map((inst) => ({
          ...inst,
          data: [...inst.data, MUTED_CELL],
        })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateSectionName = useCallback(
    (sectionIndex: number, name: string) => {
      setMusic((prev) => {
        const section = prev.sections[sectionIndex];
        if (!section) return prev;
        const updated: Music = {
          ...prev,
          sections: replaceAt(prev.sections, sectionIndex, {
            ...section,
            name,
          }),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const updateInstrumentName = useCallback(
    (instrumentId: string, name: string) => {
      setMusic((prev) => {
        const updated: Music = {
          ...prev,
          instruments: prev.instruments.map((inst) =>
            inst.id === instrumentId ? { ...inst, name } : inst,
          ),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const addInstrument = useCallback(() => {
    setMusic((prev) => {
      const newInst: Instrument = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? `inst-${crypto.randomUUID()}`
            : `inst-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: "Instrumento",
        color: pickRandomColor(),
        freq: "low-mid",
        group: NEW_INSTRUMENT_GROUP,
        data: prev.sections.map(() => MUTED_CELL),
      };
      const updated: Music = {
        ...prev,
        instruments: [...prev.instruments, newInst],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeInstrument = useCallback((instrumentId: string) => {
    setMusic((prev) => {
      const updated: Music = {
        ...prev,
        instruments: prev.instruments.filter((item) => {
          return item.id != instrumentId;
        }),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <MusicDiagram
      music={music}
      onUpdateSectionData={updateSectionData}
      onUpdateSectionTempo={updateSectionTempo}
      onUpdateSectionName={updateSectionName}
      onUpdateInstrumentName={updateInstrumentName}
      onAddSection={addSection}
      onAddInstrument={addInstrument}
      onRemoveInstrument={removeInstrument}
    />
  );
}

export default App;

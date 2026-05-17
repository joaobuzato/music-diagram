import { useCallback, useEffect, useState } from "react";
import { MusicDiagram } from "./components/MusicDiagram/MusicDiagram";
import { MusicLibrary } from "./components/MusicDiagram/MusicLibrary";
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

const STORAGE_KEY = "music-diagram-library-v1";
const LEGACY_STORAGE_KEY = "music-diagram-data-v2";
const MUSIC_ID_PATTERN = /^[a-z0-9]{4}-[a-z0-9]{4}$/;
const MUSIC_ID_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

type Library = Record<string, Music>;
type Route = { view: "list" } | { view: "editor"; id: string };

function generateMusicId(): string {
  const pick = () =>
    MUSIC_ID_ALPHABET[Math.floor(Math.random() * MUSIC_ID_ALPHABET.length)];
  let out = "";
  for (let i = 0; i < 4; i += 1) out += pick();
  out += "-";
  for (let i = 0; i < 4; i += 1) out += pick();
  return out;
}

function readRouteFromUrl(): Route {
  const segment = globalThis.location.pathname.replace(/^\/+/, "").split("/")[0];
  if (MUSIC_ID_PATTERN.test(segment)) return { view: "editor", id: segment };
  return { view: "list" };
}

function pathFor(route: Route): string {
  return route.view === "list" ? "/" : `/${route.id}`;
}

function syncUrl(route: Route, replace = false): void {
  const target = pathFor(route);
  const { search, hash, pathname } = globalThis.location;
  if (pathname === target) return;
  const url = `${target}${search}${hash}`;
  if (replace) globalThis.history.replaceState(null, "", url);
  else globalThis.history.pushState(null, "", url);
}

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

function normalizeInstruments(raw: unknown, sectionCount: number): Instrument[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const inst = (item ?? {}) as Partial<Instrument>;
    const data = Array.isArray(inst.data) ? (inst.data as SectionData[]) : [];
    const padded =
      data.length === sectionCount
        ? data
        : Array.from({ length: sectionCount }, (_, i) => data[i] ?? MUTED_CELL);
    return {
      id: typeof inst.id === "string" && inst.id ? inst.id : `inst-${generateMusicId()}`,
      name: typeof inst.name === "string" ? inst.name : "Instrumento",
      color: typeof inst.color === "string" ? inst.color : pickRandomColor(),
      freq: (inst.freq ?? "low-mid") as Instrument["freq"],
      group: typeof inst.group === "string" ? inst.group : NEW_INSTRUMENT_GROUP,
      data: padded,
    };
  });
}

function normalizeMusic(raw: unknown, id: string): Music {
  const data = (raw ?? {}) as Partial<Music>;
  const sections = normalizeSections(data.sections);
  return {
    id,
    title: typeof data.title === "string" ? data.title : "Nova música",
    artist: typeof data.artist === "string" ? data.artist : "",
    bpm: typeof data.bpm === "number" ? data.bpm : 120,
    key: typeof data.key === "string" ? data.key : "",
    sections,
    instruments: normalizeInstruments(data.instruments, sections.length),
  };
}

function persistLibrary(library: Library): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
}

function createBlankMusic(): Music {
  return {
    id: generateMusicId(),
    title: "Nova música",
    artist: "",
    bpm: 120,
    key: "",
    sections: [{ name: "Intro", tempo: DEFAULT_TEMPO }],
    instruments: [],
  };
}

function migrateLegacy(): Library | null {
  const old = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!old) return null;
  try {
    const parsed = JSON.parse(old);
    const candidateId = (parsed as { id?: unknown } | null)?.id;
    const id =
      typeof candidateId === "string" && MUSIC_ID_PATTERN.test(candidateId)
        ? candidateId
        : generateMusicId();
    const music = normalizeMusic(parsed, id);
    const lib: Library = { [id]: music };
    persistLibrary(lib);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return lib;
  } catch {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return null;
  }
}

function loadLibrary(): Library {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const normalized: Library = {};
        for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
          const id = MUSIC_ID_PATTERN.test(key) ? key : generateMusicId();
          normalized[id] = normalizeMusic(value, id);
        }
        // Persist back so any normalization changes are saved.
        persistLibrary(normalized);
        return normalized;
      }
    } catch {
      // fall through to migration / seeding
    }
  }

  const migrated = migrateLegacy();
  if (migrated) return migrated;

  // First-time: seed with the sample music.
  const id = generateMusicId();
  const seeded: Library = { [id]: normalizeMusic(sampleMusic, id) };
  persistLibrary(seeded);
  return seeded;
}

function replaceAt<T>(arr: T[], index: number, value: T): T[] {
  const out = arr.slice();
  out[index] = value;
  return out;
}

function moveAt<T>(arr: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) {
    return arr;
  }
  const out = arr.slice();
  const [item] = out.splice(from, 1);
  out.splice(to, 0, item);
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
  const [library, setLibrary] = useState<Library>(loadLibrary);
  const [route, setRoute] = useState<Route>(() => {
    const initial = readRouteFromUrl();
    if (initial.view === "editor") {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as Library | null) : null;
      if (!parsed?.[initial.id]) {
        syncUrl({ view: "list" }, true);
        return { view: "list" };
      }
    }
    syncUrl(initial, true);
    return initial;
  });

  // Browser back/forward
  useEffect(() => {
    const onPop = () => setRoute(readRouteFromUrl());
    globalThis.addEventListener("popstate", onPop);
    return () => globalThis.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((next: Route) => {
    syncUrl(next);
    setRoute(next);
  }, []);

  const activeId = route.view === "editor" ? route.id : null;
  const activeMusic = activeId ? library[activeId] ?? null : null;

  const updateActiveMusic = useCallback(
    (updater: (prev: Music) => Music) => {
      setLibrary((prev) => {
        if (!activeId) return prev;
        const current = prev[activeId];
        if (!current) return prev;
        const next = updater(current);
        if (next === current) return prev;
        const updated: Library = { ...prev, [activeId]: next };
        persistLibrary(updated);
        return updated;
      });
    },
    [activeId],
  );

  const updateSectionData = useCallback(
    (instrumentId: string, sectionIndex: number, next: SectionData) => {
      updateActiveMusic((prev) => ({
        ...prev,
        instruments: withUpdatedInstrument(
          prev.instruments,
          instrumentId,
          sectionIndex,
          next,
        ),
      }));
    },
    [updateActiveMusic],
  );

  const updateSectionTempo = useCallback(
    (sectionIndex: number, tempo: string) => {
      updateActiveMusic((prev) => {
        const section = prev.sections[sectionIndex];
        if (!section) return prev;
        return {
          ...prev,
          sections: replaceAt(prev.sections, sectionIndex, { ...section, tempo }),
        };
      });
    },
    [updateActiveMusic],
  );

  const addSection = useCallback(
    (name: string, tempo: string) => {
      updateActiveMusic((prev) => {
        const newSection: Section = { name, tempo };
        return {
          ...prev,
          sections: [...prev.sections, newSection],
          instruments: prev.instruments.map((inst) => ({
            ...inst,
            data: [...inst.data, MUTED_CELL],
          })),
        };
      });
    },
    [updateActiveMusic],
  );

  const updateSectionName = useCallback(
    (sectionIndex: number, name: string) => {
      updateActiveMusic((prev) => {
        const section = prev.sections[sectionIndex];
        if (!section) return prev;
        return {
          ...prev,
          sections: replaceAt(prev.sections, sectionIndex, { ...section, name }),
        };
      });
    },
    [updateActiveMusic],
  );

  const updateInstrumentName = useCallback(
    (instrumentId: string, name: string) => {
      updateActiveMusic((prev) => ({
        ...prev,
        instruments: prev.instruments.map((inst) =>
          inst.id === instrumentId ? { ...inst, name } : inst,
        ),
      }));
    },
    [updateActiveMusic],
  );

  const addInstrument = useCallback(() => {
    updateActiveMusic((prev) => {
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
      return { ...prev, instruments: [...prev.instruments, newInst] };
    });
  }, [updateActiveMusic]);

  const reorderSection = useCallback(
    (from: number, to: number) => {
      updateActiveMusic((prev) => {
        const sections = moveAt(prev.sections, from, to);
        if (sections === prev.sections) return prev;
        return {
          ...prev,
          sections,
          instruments: prev.instruments.map((inst) => ({
            ...inst,
            data: moveAt(inst.data, from, to),
          })),
        };
      });
    },
    [updateActiveMusic],
  );

  const reorderInstrument = useCallback(
    (fromId: string, toId: string) => {
      updateActiveMusic((prev) => {
        if (fromId === toId) return prev;
        const from = prev.instruments.findIndex((i) => i.id === fromId);
        const to = prev.instruments.findIndex((i) => i.id === toId);
        if (from === -1 || to === -1) return prev;
        const targetGroup = prev.instruments[to].group;
        const moved = prev.instruments[from];
        const sameGroup = moved.group === targetGroup;
        const reGrouped = sameGroup ? moved : { ...moved, group: targetGroup };
        const withGroup = sameGroup
          ? prev.instruments
          : replaceAt(prev.instruments, from, reGrouped);
        const instruments = moveAt(withGroup, from, to);
        if (instruments === withGroup && sameGroup) return prev;
        return { ...prev, instruments };
      });
    },
    [updateActiveMusic],
  );

  const removeInstrument = useCallback(
    (instrumentId: string) => {
      updateActiveMusic((prev) => ({
        ...prev,
        instruments: prev.instruments.filter((item) => item.id !== instrumentId),
      }));
    },
    [updateActiveMusic],
  );

  const openMusic = useCallback(
    (id: string) => {
      if (!library[id]) return;
      navigate({ view: "editor", id });
    },
    [library, navigate],
  );

  const goToLibrary = useCallback(() => {
    navigate({ view: "list" });
  }, [navigate]);

  const createMusic = useCallback(() => {
    const fresh = createBlankMusic();
    setLibrary((prev) => {
      const updated: Library = { ...prev, [fresh.id]: fresh };
      persistLibrary(updated);
      return updated;
    });
    navigate({ view: "editor", id: fresh.id });
  }, [navigate]);

  const deleteMusic = useCallback(
    (id: string) => {
      setLibrary((prev) => {
        if (!prev[id]) return prev;
        const updated = { ...prev };
        delete updated[id];
        persistLibrary(updated);
        return updated;
      });
      if (route.view === "editor" && route.id === id) {
        navigate({ view: "list" });
      }
    },
    [navigate, route],
  );

  if (route.view === "list" || !activeMusic) {
    return (
      <MusicLibrary
        library={library}
        onOpen={openMusic}
        onCreate={createMusic}
        onDelete={deleteMusic}
      />
    );
  }

  return (
    <MusicDiagram
      music={activeMusic}
      onBackToLibrary={goToLibrary}
      onUpdateSectionData={updateSectionData}
      onUpdateSectionTempo={updateSectionTempo}
      onUpdateSectionName={updateSectionName}
      onUpdateInstrumentName={updateInstrumentName}
      onAddSection={addSection}
      onAddInstrument={addInstrument}
      onRemoveInstrument={removeInstrument}
      onReorderSection={reorderSection}
      onReorderInstrument={reorderInstrument}
    />
  );
}

export default App;

# CLAUDE.md

Editor visual de arranjo musical (React 19 + TS + Vite). Mostra instrumentos por seção da música em grade temporal e um painel de campo estéreo "Art of Mixing". Idioma da UI: **pt-BR**.

## Stack
React 19, TypeScript, Vite 8, ESLint flat config, CSS Modules. Sem libs de UI, sem router, sem backend. Persistência via `localStorage` (chave `music-diagram-library-v1`, formato `Record<string, Music>` — múltiplas músicas). Roteamento simples via `pushState`/`popstate`: `/` = biblioteca, `/{id}` = editor.

Scripts: `npm run dev` | `build` | `lint` | `preview`.

## Layout

- [src/App.tsx](src/App.tsx) — biblioteca (`Record<string, Music>`), rota derivada da URL, todos os handlers (add/update/reorder/remove + create/delete música), persiste a cada mutação. Migra `music-diagram-data-v2` → novo formato automaticamente.
- [src/data/sampleMusic.json](src/data/sampleMusic.json) — seed na primeira visita; após isso, "Nova música" gera blank (1 seção, sem instrumentos).
- [src/components/MusicDiagram/](src/components/MusicDiagram/) — UI inteira:
  - [MusicLibrary.tsx](src/components/MusicDiagram/MusicLibrary.tsx) lista de músicas salvas (rota `/`) com criar/abrir/remover
  - [MusicDiagram.tsx](src/components/MusicDiagram/MusicDiagram.tsx) raiz do editor · [DiagramHeader](src/components/MusicDiagram/DiagramHeader.tsx) título/BPM/key + botão "voltar para biblioteca"
  - [SectionsBar](src/components/MusicDiagram/SectionsBar.tsx) seleção+reorder de seções
  - [TimelinePanel](src/components/MusicDiagram/TimelinePanel.tsx) grade instrumento×seção; usa [InstrumentRow](src/components/MusicDiagram/InstrumentRow.tsx) → [SectionCell](src/components/MusicDiagram/SectionCell.tsx) (cada célula edita `pan/dyn/prom`)
  - [StereoPanel](src/components/MusicDiagram/StereoPanel.tsx) + [StereoCanvas](src/components/MusicDiagram/StereoCanvas.tsx) + [drawStereo](src/components/MusicDiagram/utils/drawStereo.ts) — canvas 2D do campo estéreo da seção ativa
  - [GroupSection](src/components/MusicDiagram/GroupSection.tsx) agrupa instrumentos por `group`
  - [TimelineHeader](src/components/MusicDiagram/TimelineHeader.tsx) · [PanRuler](src/components/MusicDiagram/PanRuler.tsx) · [FreqLegend](src/components/MusicDiagram/FreqLegend.tsx)
  - [EditableLabel](src/components/MusicDiagram/EditableLabel.tsx) input inline reutilizável · [DragHandle](src/components/MusicDiagram/DragHandle.tsx) drag HTML5 nativo
  - [types.ts](src/components/MusicDiagram/types.ts) `Music/Section/Instrument/SectionData/FreqBand`
  - [constants.ts](src/components/MusicDiagram/constants.ts) `FREQ_COLORS`, dimensões de célula
  - [utils/tempo.ts](src/components/MusicDiagram/utils/tempo.ts) `DEFAULT_TEMPO` e helpers de compasso
  - [MusicDiagram.module.css](src/components/MusicDiagram/MusicDiagram.module.css) **único CSS Module** — toda classe vem daqui
- [src/html/arranjo_musical.html](src/html/arranjo_musical.html) — protótipo HTML estático original (não é build target; consulte só para entender intenção visual).

## Modelo de dados

```ts
Music { title; artist; bpm; key; sections: Section[]; instruments: Instrument[] }
Section { name; tempo }                          // tempo = compasso, ex. "4/4"
Instrument { id; name; color; freq; group; data: SectionData[] }  // data.length === sections.length
SectionData { pan: -1..1; dyn: 0..1; prom: 0..1 }
FreqBand = 'sub' | 'low-mid' | 'high-mid' | 'high' | 'vocal'
```

Invariante: `instrument.data[i]` corresponde a `sections[i]`. Toda mutação que altera seções (add/reorder) deve aplicar a mesma operação em cada `instrument.data` — vide [App.tsx](src/App.tsx) `addSection`/`reorderSection`.

## Convenções

- Estado mutado **apenas** via setters em [App.tsx](src/App.tsx); componentes recebem callbacks. Não introduza context/Redux.
- Cada mutação grava `localStorage` no mesmo `setLibrary` (via `updateActiveMusic`). Mantenha esse padrão (não extraia para `useEffect` — causa write extra no mount).
- Props com `Readonly<>` é convenção do repo.
- Helpers imutáveis `replaceAt`/`moveAt` em [App.tsx](src/App.tsx) — reutilize antes de criar novos.
- IDs de instrumento: `crypto.randomUUID()` com fallback. Não reaproveite `name` como id.
- Reorder usa drag-and-drop HTML5 nativo (ver [DragHandle](src/components/MusicDiagram/DragHandle.tsx)); não adicione libs.
- Strings de UI em pt-BR.

## Ao editar

- Adicionou campo em `SectionData`/`Instrument`/`Section`? Atualize [types.ts](src/components/MusicDiagram/types.ts), `MUTED_CELL`/handlers em [App.tsx](src/App.tsx), `normalizeSections` (migração de dados antigos do `localStorage`) e o [sampleMusic.json](src/data/sampleMusic.json).
- Mudou o shape persistido? Incremente o sufixo de `STORAGE_KEY` em [App.tsx](src/App.tsx) (`music-diagram-library-vN`) para invalidar dados antigos dos usuários. Se quiser preservar, adicione lógica em `loadLibrary`/`normalizeMusic`.
- Estilo: edite [MusicDiagram.module.css](src/components/MusicDiagram/MusicDiagram.module.css); não crie novos `.module.css` por componente.
- Cores de banda de frequência vêm de `FREQ_COLORS` em [constants.ts](src/components/MusicDiagram/constants.ts) — não hardcode hex em componentes.

## Validação

`npm run lint` e `npm run build` (build roda `tsc -b` antes do Vite — type-check obrigatório). Sem suíte de testes.

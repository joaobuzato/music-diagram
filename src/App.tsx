import { MusicDiagram } from './components/MusicDiagram/MusicDiagram';
import type { Music } from './components/MusicDiagram/types';
import sampleMusic from './data/sampleMusic.json';

const STORAGE_KEY = 'music-diagram-data-v2';

function loadMusic(): Music {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored) as Music;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleMusic));
  return sampleMusic as Music;
}

function App() {
  return <MusicDiagram music={loadMusic()} />;
}

export default App;

import { Song } from '../types.ts';

// Helper to generate word-by-word timestamps from text with start and end times
function createLine(
  id: string,
  startTime: number,
  endTime: number,
  wordsText: string[],
  wordDurations?: number[]
) {
  const count = wordsText.length;
  const lineDuration = endTime - startTime;
  const words: { text: string; startTime: number; endTime: number }[] = [];
  
  let currentStart = startTime;
  for (let i = 0; i < count; i++) {
    const wordDur = wordDurations && wordDurations[i] !== undefined 
      ? wordDurations[i] 
      : lineDuration / count;
    const wordEnd = i === count - 1 ? endTime : Math.min(endTime, currentStart + wordDur);
    words.push({
      text: wordsText[i],
      startTime: Number(currentStart.toFixed(2)),
      endTime: Number(wordEnd.toFixed(2)),
    });
    currentStart = wordEnd;
  }

  return {
    id,
    startTime,
    endTime,
    text: wordsText.join(' '),
    words,
  };
}

export const SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Midnight Horizon',
    artist: 'Aethel & The Void',
    album: 'Zero Luminance',
    year: '2026',
    genre: 'Synthwave / Dark Electro',
    duration: 184, // 3:04
    quality: 'Master · 24-bit / 96 kHz',
    accentColor: '#8b5cf6', // Electric violet
    secondaryColor: '#06b6d4', // Cyan
    coverStyle: {
      type: 'eclipse',
      baseGradient: 'from-violet-950 via-black to-black',
      accentGlow: 'rgba(139, 92, 246, 0.35)',
    },
    audioTrackId: 'midnight',
    lyrics: [
      createLine('mh-1', 4.0, 7.8, ['Lost', 'in', 'the', 'neon', 'rain'], [0.8, 0.4, 0.4, 1.2, 1.0]),
      createLine('mh-2', 8.2, 12.0, ['Where', 'shadows', 'fall', 'and', 'drift', 'away'], [0.6, 0.9, 0.7, 0.4, 0.6, 0.6]),
      createLine('mh-3', 12.5, 16.2, ['We', 'chase', 'the', 'signal', 'through', 'the', 'dark'], [0.4, 0.7, 0.4, 0.9, 0.5, 0.3, 0.5]),
      createLine('mh-4', 16.5, 20.2, ['A', 'distant', 'fire,', 'a', 'dying', 'spark'], [0.3, 0.8, 0.8, 0.3, 0.8, 0.7]),
      createLine('mh-5', 21.0, 25.5, ['Let', 'the', 'midnight', 'rhythm', 'take', 'control'], [0.5, 0.4, 0.9, 1.1, 0.7, 0.9]),
      createLine('mh-6', 26.0, 30.5, ['Rewriting', 'memories', 'inside', 'my', 'soul'], [1.0, 1.1, 0.8, 0.5, 1.1]),
      createLine('mh-7', 31.0, 35.8, ['Beneath', 'the', 'towers', 'of', 'obsidian', 'stone'], [0.8, 0.3, 1.0, 0.4, 1.1, 1.2]),
      createLine('mh-8', 36.2, 40.5, ['We', 'find', 'our', 'sanctuary', 'all', 'alone'], [0.4, 0.6, 0.5, 1.4, 0.5, 0.9]),
      createLine('mh-9', 42.0, 46.5, ['Hold', 'on', 'until', 'the', 'morning', 'breaks'], [0.8, 0.5, 0.7, 0.4, 1.0, 1.1]),
      createLine('mh-10', 47.0, 51.8, ['Beyond', 'the', 'echoes', 'and', 'the', 'heartaches'], [0.8, 0.4, 1.0, 0.4, 0.4, 1.8]),
      createLine('mh-11', 53.0, 58.2, ['Electric', 'pulses', 'vibrating', 'the', 'floor'], [0.9, 0.8, 1.2, 0.4, 1.9]),
      createLine('mh-12', 59.0, 64.0, ['Step', 'through', 'the', 'portal,', 'open', 'the', 'door'], [0.6, 0.7, 0.4, 1.3, 0.8, 0.4, 0.8]),
      createLine('mh-13', 65.0, 71.5, ['The', 'city', 'sleeps,', 'but', 'we', 'remain', 'awake'], [0.4, 0.7, 1.2, 0.5, 0.5, 1.2, 2.0]),
      createLine('mh-14', 72.0, 77.8, ['With', 'every', 'silent', 'breath', 'we', 'take'], [0.5, 0.7, 0.8, 1.0, 0.6, 2.2]),
      createLine('mh-15', 80.0, 85.5, ['Lost', 'in', 'the', 'neon', 'rain'], [0.9, 0.4, 0.4, 1.6, 2.2]),
      createLine('mh-16', 86.0, 92.0, ['We', 'chase', 'the', 'midnight', 'horizon', 'again'], [0.5, 0.8, 0.5, 1.2, 1.5, 1.5]),
    ],
  },
  {
    id: 'song-2',
    title: 'Neon Rain',
    artist: 'Kuroshio',
    album: 'Shibuya After Dark',
    year: '2026',
    genre: 'Future Beats / Cyber Noir',
    duration: 172, // 2:52
    quality: 'Hi-Res · 24-bit / 48 kHz',
    accentColor: '#f43f5e', // Rose neon
    secondaryColor: '#f59e0b', // Amber
    coverStyle: {
      type: 'neon',
      baseGradient: 'from-rose-950 via-neutral-950 to-black',
      accentGlow: 'rgba(244, 63, 94, 0.35)',
    },
    audioTrackId: 'neon',
    lyrics: [
      createLine('nr-1', 3.5, 7.2, ['Raindrops', 'ignite', 'the', 'asphalt', 'street'], [0.9, 0.8, 0.3, 0.9, 0.8]),
      createLine('nr-2', 7.8, 11.5, ['Walking', 'to', 'a', 'steady', 'pulse', 'and', 'beat'], [0.8, 0.3, 0.2, 0.8, 0.8, 0.3, 0.5]),
      createLine('nr-3', 12.0, 15.8, ['Reflections', 'glowing', 'in', 'your', 'eyes'], [1.0, 0.9, 0.3, 0.5, 1.1]),
      createLine('nr-4', 16.2, 20.5, ['Beneath', 'the', 'carbon-tinted', 'skies'], [0.7, 0.4, 1.4, 1.8]),
      createLine('nr-5', 21.0, 25.2, ['Countless', 'strangers', 'passing', 'by'], [0.8, 0.9, 0.8, 1.7]),
      createLine('nr-6', 25.8, 30.0, ['Underneath', 'the', 'crimson', 'neon', 'sky'], [0.8, 0.3, 0.8, 0.9, 1.4]),
      createLine('nr-7', 30.5, 35.0, ['Time', 'stands', 'still', 'when', 'we', 'collide'], [0.6, 0.7, 0.6, 0.5, 0.4, 1.7]),
      createLine('nr-8', 35.5, 41.0, ['With', 'nowhere', 'left', 'for', 'us', 'to', 'hide'], [0.4, 0.8, 0.5, 0.4, 0.5, 0.4, 2.5]),
      createLine('nr-9', 42.0, 47.5, ['Neon', 'rain,', 'wash', 'away', 'the', 'pain'], [0.8, 0.9, 0.6, 0.8, 0.4, 2.0]),
      createLine('nr-10', 48.0, 54.0, ['Whisper', 'my', 'name', 'through', 'the', 'subway', 'train'], [0.8, 0.4, 0.8, 0.6, 0.4, 1.0, 2.0]),
    ],
  },
  {
    id: 'song-3',
    title: 'Starlight Reverie',
    artist: 'Cosmic Echoes',
    album: 'Infinite Void',
    year: '2026',
    genre: 'Ambient / Chillwave',
    duration: 215, // 3:35
    quality: 'Spatial Audio · 24-bit / 96 kHz',
    accentColor: '#38bdf8', // Celestial Sky
    secondaryColor: '#a855f7', // Purple
    coverStyle: {
      type: 'cosmic',
      baseGradient: 'from-sky-950 via-slate-950 to-black',
      accentGlow: 'rgba(56, 189, 248, 0.35)',
    },
    audioTrackId: 'starlight',
    lyrics: [
      createLine('sr-1', 4.0, 8.5, ['Floating', 'across', 'the', 'silver', 'sea'], [1.0, 0.8, 0.4, 1.0, 1.3]),
      createLine('sr-2', 9.0, 13.5, ['Beyond', 'the', 'edge', 'of', 'gravity'], [0.9, 0.5, 0.7, 0.4, 2.0]),
      createLine('sr-3', 14.2, 19.0, ['Infinite', 'constellations', 'gleam'], [0.9, 1.9, 2.0]),
      createLine('sr-4', 19.5, 24.5, ["We're", 'caught', 'inside', 'a', 'lucid', 'dream'], [0.5, 0.8, 0.9, 0.3, 1.0, 1.5]),
      createLine('sr-5', 25.2, 30.5, ['Drifting', 'softly', 'through', 'the', 'night'], [1.0, 0.8, 0.6, 0.4, 2.5]),
      createLine('sr-6', 31.0, 36.8, ['Guided', 'by', 'the', 'ancient', 'light'], [0.9, 0.5, 0.4, 1.2, 2.8]),
      createLine('sr-7', 37.5, 43.0, ['Every', 'star', 'a', 'whispered', 'prayer'], [0.8, 0.9, 0.3, 1.2, 2.3]),
      createLine('sr-8', 43.8, 50.0, ['Suspended', 'in', 'the', 'weightless', 'air'], [1.1, 0.4, 0.4, 1.3, 3.0]),
    ],
  },
  {
    id: 'song-4',
    title: 'Velvet Dreams',
    artist: 'Sora & Lyra',
    album: 'Obsidian Silhouette',
    year: '2026',
    genre: 'Neo-Soul / Ambient R&B',
    duration: 192, // 3:12
    quality: 'Master · 24-bit / 192 kHz',
    accentColor: '#10b981', // Emerald
    secondaryColor: '#047857',
    coverStyle: {
      type: 'monolith',
      baseGradient: 'from-emerald-950 via-zinc-950 to-black',
      accentGlow: 'rgba(16, 185, 129, 0.35)',
    },
    audioTrackId: 'velvet',
    lyrics: [
      createLine('vd-1', 3.8, 8.0, ['Slow', 'down', 'the', 'spinning', 'world', 'tonight'], [0.8, 0.7, 0.4, 0.9, 0.8, 0.6]),
      createLine('vd-2', 8.5, 13.0, ['Bathed', 'in', 'the', 'soft', 'and', 'amber', 'light'], [0.8, 0.4, 0.4, 0.9, 0.4, 0.9, 0.7]),
      createLine('vd-3', 13.5, 18.2, ['Whisper', 'the', 'words', 'you', 'left', 'unsaid'], [0.9, 0.4, 0.8, 0.5, 0.8, 1.3]),
      createLine('vd-4', 18.8, 23.5, ['Soft', 'velvet', 'thoughts', 'inside', 'my', 'head'], [0.7, 0.8, 0.9, 0.8, 0.4, 1.1]),
      createLine('vd-5', 24.0, 29.2, ['No', 'need', 'to', 'rush,', 'no', 'need', 'to', 'fear'], [0.4, 0.6, 0.4, 1.0, 0.4, 0.6, 0.4, 1.4]),
      createLine('vd-6', 29.8, 35.0, ['Just', 'stay', 'with', 'me', 'right', 'now', 'and', 'here'], [0.5, 0.7, 0.5, 0.6, 0.7, 0.6, 0.4, 1.2]),
    ],
  },
  {
    id: 'song-5',
    title: 'Solar Flare',
    artist: 'Astral Pulse',
    album: 'Photons',
    year: '2026',
    genre: 'Melodic Electronic / House',
    duration: 204, // 3:24
    quality: 'Lossless · 24-bit / 96 kHz',
    accentColor: '#f97316', // Solar Orange
    secondaryColor: '#e11d48',
    coverStyle: {
      type: 'geometric',
      baseGradient: 'from-orange-950 via-neutral-950 to-black',
      accentGlow: 'rgba(249, 115, 22, 0.35)',
    },
    audioTrackId: 'solar',
    lyrics: [
      createLine('sf-1', 4.2, 8.2, ['Ignite', 'the', 'dawn', 'with', 'golden', 'fire'], [0.8, 0.4, 0.7, 0.5, 0.9, 0.7]),
      createLine('sf-2', 8.8, 12.9, ['Higher', 'and', 'higher', 'we', 'aspire'], [0.8, 0.4, 0.9, 0.6, 1.4]),
      createLine('sf-3', 13.5, 17.6, ['The', 'morning', 'breaks', 'the', 'quiet', 'gloom'], [0.4, 0.8, 0.8, 0.4, 0.8, 0.9]),
      createLine('sf-4', 18.2, 22.8, ['Filling', 'with', 'warmth', 'the', 'silent', 'room'], [0.8, 0.5, 0.8, 0.4, 0.8, 1.3]),
      createLine('sf-5', 23.5, 28.5, ['A', 'solar', 'flare', 'across', 'the', 'sky'], [0.4, 0.9, 0.9, 0.8, 0.4, 1.6]),
      createLine('sf-6', 29.0, 34.0, ['Watch', 'all', 'the', 'shadows', 'multiply'], [0.6, 0.5, 0.4, 1.0, 2.5]),
    ],
  },
];

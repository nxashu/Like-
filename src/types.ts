export interface LyricWord {
  text: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
}

export interface LyricLine {
  id: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  words: LyricWord[];
  text: string;
  romanization?: string;
  translation?: string;
}

export type AppTab = 'home' | 'mix' | 'library' | 'search';
export type UIStyle = 'amoled' | 'liquidGlass' | 'material3';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: string;
  genre: string;
  duration: number; // in seconds
  quality: string;  // e.g. "Lossless · 24-bit / 96 kHz FLAC"
  accentColor: string; // Hex color for subtle ambient glow
  secondaryColor: string;
  coverStyle: {
    type: 'eclipse' | 'neon' | 'cosmic' | 'monolith' | 'geometric';
    baseGradient: string;
    accentGlow: string;
  };
  audioTrackId: 'midnight' | 'neon' | 'starlight' | 'velvet' | 'solar' | 'custom' | 'youtube';
  youtubeVideoId?: string;
  thumbnailUrl?: string;
  views?: string;
  customAudioUrl?: string;
  lyrics: LyricLine[];
}

export type ViewMode = 'player' | 'split' | 'lyrics';
export type RepeatMode = 'off' | 'all' | 'one';

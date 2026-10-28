import React, { useState } from 'react';
import { Play, Sparkles, Heart, Radio, Disc } from 'lucide-react';
import { MIX_PLAYLISTS, MOOD_CATEGORIES, PlaylistCard } from '../data/mockData.ts';
import { Song } from '../types.ts';

interface MixViewProps {
  onPlaySong: (song: Song) => void;
  onOpenSearchWithCategory: (category: string) => void;
  songs: Song[];
}

export const MixView: React.FC<MixViewProps> = ({
  onPlaySong,
  onOpenSearchWithCategory,
  songs,
}) => {
  const [subTab, setSubTab] = useState<'mix' | 'local' | 'favorite'>('mix');

  const handlePlayMix = (mix: PlaylistCard) => {
    // Play first song or matching song from list
    if (songs.length > 0) {
      onPlaySong(songs[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-8 select-none pb-28">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Mix for you
        </h1>
      </div>

      {/* Segmented Filter Bar (Screenshot 4) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSubTab('mix')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            subTab === 'mix'
              ? 'bg-white text-black shadow-md'
              : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          Mix for you
        </button>
        <button
          onClick={() => setSubTab('local')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            subTab === 'local'
              ? 'bg-white text-black shadow-md'
              : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          Your Local Playlists
        </button>
        <button
          onClick={() => setSubTab('favorite')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            subTab === 'favorite'
              ? 'bg-white text-black shadow-md'
              : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          Favorite Playlists
        </button>
      </div>

      {/* Mix For You 2x3 Grid Cards (Screenshot 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {MIX_PLAYLISTS.map((mix) => (
          <div
            key={mix.id}
            onClick={() => handlePlayMix(mix)}
            className="group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 transition-all cursor-pointer bg-neutral-950/70 hover:scale-[1.02] active:scale-[0.99] shadow-xl aspect-square"
          >
            {/* Background Gradient Mesh */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${mix.coverGradient} opacity-35 group-hover:opacity-55 transition-opacity`}
            />

            {/* Top Row: Badge & Icon */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 text-white/90 border border-white/15">
                {mix.badge || 'Mix'}
              </span>
              {mix.icon === 'heart' ? (
                <Heart className="w-5 h-5 text-rose-400 fill-current" />
              ) : (
                <Disc className="w-5 h-5 text-white/60 group-hover:rotate-45 transition-transform" />
              )}
            </div>

            {/* Play Button Overlay on Hover */}
            <div className="relative z-10 self-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              </div>
            </div>

            {/* Bottom Row: Title & Subtitle */}
            <div className="relative z-10">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {mix.title}
              </h3>
              <p className="text-[11px] text-neutral-300 font-medium line-clamp-1 mt-0.5 opacity-80">
                {mix.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Moods & Moments (Screenshot 6) */}
      <div className="space-y-3 pt-2">
        <h2 className="text-lg font-bold text-white tracking-tight">Moods & moments</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MOOD_CATEGORIES.map((mood) => (
            <div
              key={mood.id}
              onClick={() => onOpenSearchWithCategory(mood.name)}
              className={`relative overflow-hidden p-3.5 rounded-2xl bg-gradient-to-r ${mood.gradient} cursor-pointer hover:opacity-90 transition-opacity h-20 flex flex-col justify-between`}
            >
              <span className="text-sm font-bold text-white tracking-tight drop-shadow">
                {mood.name}
              </span>
              <div className="self-end text-[10px] font-mono text-white/80 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                Explore
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

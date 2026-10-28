import React, { useState } from 'react';
import { Play, Sparkles, Radio, Flame, Plus, Heart } from 'lucide-react';
import { Song } from '../types.ts';
import { TOP_ARTISTS } from '../data/mockData.ts';

interface HomeViewProps {
  onPlaySong: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
  songs: Song[];
  currentSongId: string;
  onOpenSearch: () => void;
  onSelectArtist: (artistId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onPlaySong,
  onAddToQueue,
  songs,
  currentSongId,
  onOpenSearch,
  onSelectArtist,
}) => {
  const [selectedMood, setSelectedMood] = useState('All');
  const moods = ['All', 'Relax', 'Sleep', 'Energize', 'Sad', 'Romance'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-8 select-none pb-28">
      {/* Header Greeting & Mood Pills (Screenshot 5) */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
            Welcome to nxmusic
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Good Evening
          </h1>
        </div>

        {/* Mood filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedMood === mood
                  ? 'bg-white text-black shadow-md'
                  : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Picks / Radio Section (Screenshot 5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
              LET&apos;S START WITH A RADIO
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Quick picks</h2>
          </div>
          <button
            onClick={onOpenSearch}
            className="text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            Explore all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {songs.slice(0, 6).map((song) => {
            const isCurrent = song.id === currentSongId;

            return (
              <div
                key={song.id}
                onClick={() => onPlaySong(song)}
                className={`group flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-white/15 border-white/20'
                    : 'bg-neutral-950/70 border-white/5 hover:border-white/15 hover:bg-neutral-900/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-white/10 flex items-center justify-center">
                    {song.thumbnailUrl ? (
                      <img
                        src={song.thumbnailUrl}
                        alt={song.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: song.accentColor }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-5 h-5 fill-white text-white" />
                    </div>
                  </div>

                  <div className="truncate pr-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-neutral-200">
                      {song.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {song.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
                    {Math.floor(song.duration / 60)}:
                    {Math.floor(song.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToQueue(song);
                    }}
                    className="p-1.5 text-neutral-500 hover:text-white rounded-lg transition-colors"
                    title="Add to queue"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Artists Row (Screenshot 2 bottom) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
              FOLLOW YOUR FAVORITE ARTISTS
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Artists</h2>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
          {TOP_ARTISTS.map((artist) => (
            <div
              key={artist.id}
              onClick={() => onSelectArtist(artist.id)}
              className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-white/10 group-hover:border-white/30 transition-all p-1 bg-neutral-900">
                <img
                  src={artist.headerImage}
                  alt={artist.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-xs font-semibold text-white group-hover:text-neutral-300">
                {artist.name}
              </span>
              <span className="text-[10px] font-mono text-neutral-500 -mt-1.5">
                {artist.subscribers.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

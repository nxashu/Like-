import React, { useState } from 'react';
import {
  Heart,
  UserCheck,
  TrendingUp,
  Download,
  Play,
  Sparkles,
  Clock,
  Music,
  Calendar,
  ChevronRight,
  Disc,
} from 'lucide-react';
import { TOP_ARTISTS, ArtistProfile } from '../data/mockData.ts';
import { Song } from '../types.ts';

interface LibraryViewProps {
  onPlaySong: (song: Song) => void;
  songs: Song[];
  selectedArtistId?: string | null;
  onClearArtist?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  onPlaySong,
  songs,
  selectedArtistId,
  onClearArtist,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'analytics' | 'artists'>(
    selectedArtistId ? 'artists' : 'library'
  );
  const [activeArtistId, setActiveArtistId] = useState<string>(
    selectedArtistId || 'jennie'
  );

  const currentArtist =
    TOP_ARTISTS.find((a) => a.id === activeArtistId) || TOP_ARTISTS[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-8 select-none pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
            nxmusic Collection
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Library
          </h1>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 bg-neutral-900 border border-white/10 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'library'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('artists')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'artists'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Artists
          </button>
        </div>
      </div>

      {/* 4 Colored Action Buttons (Screenshot 6 bottom) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-all text-left">
          <Heart className="w-5 h-5 text-rose-500 fill-current" />
          <span className="text-xs font-bold">Favorite</span>
        </button>
        <button className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all text-left">
          <UserCheck className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-bold">Followed</span>
        </button>
        <button className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 transition-all text-left">
          <TrendingUp className="w-5 h-5 text-cyan-500" />
          <span className="text-xs font-bold">Most Played</span>
        </button>
        <button className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all text-left">
          <Download className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-bold">Downloaded</span>
        </button>
      </div>

      {/* SUB-VIEW 1: Standard Library */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {/* Most Played Carousel (Screenshot 6 bottom) */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white tracking-tight">Most Played</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {songs.slice(0, 3).map((song) => (
                <div
                  key={song.id}
                  onClick={() => onPlaySong(song)}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 cursor-pointer aspect-[3/4] flex flex-col justify-end p-3.5 shadow-xl hover:border-white/30 transition-all"
                >
                  {song.thumbnailUrl ? (
                    <img
                      src={song.thumbnailUrl}
                      alt={song.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: song.accentColor }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="relative z-10">
                    <h4 className="text-sm font-bold text-white truncate drop-shadow">
                      {song.title}
                    </h4>
                    <p className="text-xs text-neutral-300 font-medium truncate mt-0.5">
                      {song.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Added Tracklist */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white tracking-tight">Recently Added</h3>
            <div className="space-y-2">
              {songs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => onPlaySong(song)}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-neutral-950/60 border border-white/5 hover:border-white/15 hover:bg-neutral-900/60 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center">
                      {song.thumbnailUrl ? (
                        <img src={song.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Disc className="w-5 h-5 text-white/60" />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        {song.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
                    {Math.floor(song.duration / 60)}:
                    {Math.floor(song.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Analytics (Screenshot 4 bottom) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Song Hero Card */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-rose-950/80 via-black to-black p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase text-rose-400 font-bold tracking-wider">
                  TOP SONG OF THE WEEK
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-tight mt-1">
                  FALLEN ANGEL
                </h3>
                <p className="text-xs text-neutral-300 font-medium">JENNIE</p>
              </div>

              <span className="text-xs font-mono text-neutral-400 bg-white/10 px-3 py-1 rounded-full">
                13 min listened
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 border-t border-white/10 pt-4">
              <div>
                <p className="text-white text-xl font-bold font-sans">53</p>
                <p className="text-[11px] text-neutral-400">Songs played</p>
              </div>
              <div className="text-emerald-400 font-semibold">+15% vs previous period</div>
            </div>
          </div>

          {/* 2026 Wrapped Banner */}
          <div className="p-5 rounded-3xl bg-neutral-900 border border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Your 2026 Wrapped is ready</h4>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                7,785 minutes, 744 artists, and one very obvious favourite.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-sky-400 text-black flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            </div>
          </div>

          {/* Quick Facts Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Quick facts</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/10">
                <span className="text-[10px] uppercase font-mono text-neutral-500">
                  Total Listened Time
                </span>
                <p className="text-lg font-bold text-white mt-1">2 h 19 min</p>
                <span className="text-[10px] text-emerald-400 font-mono">+7%</span>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/10">
                <span className="text-[10px] uppercase font-mono text-neutral-500">
                  Average Per Day
                </span>
                <p className="text-lg font-bold text-white mt-1">17 plays</p>
                <span className="text-[10px] text-emerald-400 font-mono">+54%</span>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/10">
                <span className="text-[10px] uppercase font-mono text-neutral-500">
                  Most Active Day
                </span>
                <p className="text-lg font-bold text-white mt-1">33 plays</p>
                <span className="text-[10px] text-neutral-400 font-mono">28 Aug (+43%)</span>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/10">
                <span className="text-[10px] uppercase font-mono text-neutral-500">
                  Artists Discovered
                </span>
                <p className="text-lg font-bold text-white mt-1">41</p>
                <span className="text-[10px] text-emerald-400 font-mono">+24%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Artists (Screenshot 2 bottom) */}
      {activeTab === 'artists' && (
        <div className="space-y-6">
          {/* Artists selector tabs */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            {TOP_ARTISTS.map((artist) => (
              <button
                key={artist.id}
                onClick={() => setActiveArtistId(artist.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all ${
                  activeArtistId === artist.id
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-900 text-neutral-400 border-white/10 hover:text-white'
                }`}
              >
                <span>{artist.name}</span>
              </button>
            ))}
          </div>

          {/* Artist Hero Header (Screenshot 2 bottom) */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 aspect-[16/9] sm:aspect-[21/9] flex flex-col justify-end p-6 shadow-2xl">
            <img
              src={currentArtist.headerImage}
              alt={currentArtist.name}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 space-y-2">
              <h2 className="text-4xl sm:text-5xl font-black italic tracking-tight text-white drop-shadow-lg">
                {currentArtist.name}
              </h2>
              <p className="text-xs font-mono text-neutral-300">
                {currentArtist.subscribers} · {currentArtist.views}
              </p>
            </div>
          </div>

          {/* Artist Popular Tracks */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white tracking-tight">Popular Tracks</h3>
            <div className="space-y-2">
              {(currentArtist.popularTracks.length > 0 ? currentArtist.popularTracks : songs).map((track) => (
                <div
                  key={track.id}
                  onClick={() => onPlaySong(track)}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-neutral-950/60 border border-white/5 hover:border-white/15 hover:bg-neutral-900/60 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center">
                      {track.thumbnailUrl ? (
                        <img src={track.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Disc className="w-5 h-5 text-white/60" />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        {track.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
                    {Math.floor(track.duration / 60)}:
                    {Math.floor(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

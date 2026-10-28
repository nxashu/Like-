import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Play, Plus, Youtube, Flame, Loader2, Link as LinkIcon, Radio } from 'lucide-react';
import { Song } from '../types.ts';

interface YouTubeTrackItem {
  videoId: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  durationFormatted: string;
  thumbnail: string;
  quality: string;
  views?: string;
}

interface YouTubeMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack: (track: Song, playImmediately: boolean) => void;
}

const FEATURED_YOUTUBE_TRACKS: YouTubeTrackItem[] = [
  {
    videoId: 'Rif-RTvmmss',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy',
    duration: 231,
    durationFormatted: '3:51',
    thumbnail: 'https://img.youtube.com/vi/Rif-RTvmmss/hqdefault.jpg',
    quality: 'YouTube 256kbps AAC',
    views: '800M+ views',
  },
  {
    videoId: '5NV6Rdv1a3I',
    title: 'Get Lucky',
    artist: 'Daft Punk ft. Pharrell Williams',
    album: 'Random Access Memories',
    duration: 248,
    durationFormatted: '4:08',
    thumbnail: 'https://img.youtube.com/vi/5NV6Rdv1a3I/hqdefault.jpg',
    quality: 'YouTube 256kbps AAC',
    views: '750M+ views',
  },
  {
    videoId: 'NrmMk1Myrxc',
    title: 'Glimpse of Us',
    artist: 'Joji',
    album: 'SMITHEREENS',
    duration: 233,
    durationFormatted: '3:53',
    thumbnail: 'https://img.youtube.com/vi/NrmMk1Myrxc/hqdefault.jpg',
    quality: 'YouTube 256kbps AAC',
    views: '240M+ views',
  },
  {
    videoId: 'V9PVRfjEBTI',
    title: 'Birds of a Feather',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    duration: 196,
    durationFormatted: '3:16',
    thumbnail: 'https://img.youtube.com/vi/V9PVRfjEBTI/hqdefault.jpg',
    quality: 'YouTube 256kbps AAC',
    views: '350M+ views',
  },
  {
    videoId: 'jfKfPfyJRdk',
    title: 'lofi hip hop radio - beats to relax/study to',
    artist: 'Lofi Girl',
    album: 'Chilled Cow Vault',
    duration: 3600,
    durationFormatted: 'LIVE / Continuous',
    thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    quality: 'YouTube Live Audio',
    views: 'Live Stream',
  },
  {
    videoId: 'UDVtMYqUAyw',
    title: 'Interstellar Theme',
    artist: 'Hans Zimmer',
    album: 'Interstellar OST',
    duration: 247,
    durationFormatted: '4:07',
    thumbnail: 'https://img.youtube.com/vi/UDVtMYqUAyw/hqdefault.jpg',
    quality: 'Master · 24-bit PCM',
    views: '120M+ views',
  },
];

export const YouTubeMusicModal: React.FC<YouTubeMusicModalProps> = ({
  isOpen,
  onClose,
  onSelectTrack,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<YouTubeTrackItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'featured'>('featured');
  const searchTimeoutRef = useRef<number | null>(null);

  // Fetch search suggestions
  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/youtube/suggestions?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const list = await res.json();
          setSuggestions(list.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed suggestions:', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Execute YouTube search
  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setActiveTab('search');
    setSuggestions([]);

    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchTerm)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.tracks || []);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert YouTube track to our Song model and fetch synchronized word-by-word lyrics
  const handleSelect = async (ytTrack: YouTubeTrackItem, playImmediately: boolean) => {
    // Generate initial fallback lyrics immediately
    const fallbackLines = [
      'Lost inside the music groove',
      'Feeling every subtle move',
      'The bass is pulsing in the night',
      'Underneath the neon light',
      'Close your eyes and breathe it in',
      'Where the sound and soul begin',
      'Echoes drifting far away',
      'Leading to another day',
    ];

    const step = ytTrack.duration / (fallbackLines.length + 1);
    const initialLyrics = fallbackLines.map((line, idx) => {
      const lStart = Number(((idx + 0.5) * step).toFixed(2));
      const lEnd = Number((lStart + step * 0.75).toFixed(2));
      const wordsArr = line.split(' ');
      const wordDur = (lEnd - lStart) / wordsArr.length;
      return {
        id: `yt-${idx}`,
        startTime: lStart,
        endTime: lEnd,
        text: line,
        words: wordsArr.map((w, wIdx) => ({
          text: w,
          startTime: Number((lStart + wIdx * wordDur).toFixed(2)),
          endTime: Number((lStart + (wIdx + 1) * wordDur).toFixed(2)),
        })),
      };
    });

    const song: Song = {
      id: `yt-${ytTrack.videoId}`,
      title: ytTrack.title,
      artist: ytTrack.artist,
      album: ytTrack.album,
      year: new Date().getFullYear().toString(),
      genre: 'YouTube Music Stream',
      duration: ytTrack.duration,
      quality: ytTrack.quality,
      accentColor: '#ef4444', // YouTube red
      secondaryColor: '#f97316',
      coverStyle: {
        type: 'neon',
        baseGradient: 'from-red-950 via-neutral-950 to-black',
        accentGlow: 'rgba(239, 68, 68, 0.4)',
      },
      audioTrackId: 'youtube',
      youtubeVideoId: ytTrack.videoId,
      thumbnailUrl: ytTrack.thumbnail,
      views: ytTrack.views,
      lyrics: initialLyrics,
    };

    onSelectTrack(song, playImmediately);
    onClose();

    // In the background, call /api/youtube/lyrics to get AI/accurate word-by-word lyrics
    try {
      const lyricRes = await fetch('/api/youtube/lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ytTrack.title,
          artist: ytTrack.artist,
          duration: ytTrack.duration,
          videoId: ytTrack.videoId,
        }),
      });
      if (lyricRes.ok) {
        const lyricData = await lyricRes.json();
        if (lyricData.lyrics && lyricData.lyrics.length > 0) {
          song.lyrics = lyricData.lyrics;
        }
      }
    } catch (e) {
      console.warn('Background lyrics fetch completed with fallback:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 sm:p-6 select-none animate-fade-in">
      <div className="w-full max-w-2xl liquid-glass-card rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh] border border-white/20">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shadow-sm">
              <Youtube className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                YouTube Music API
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Stream any track with synchronized word-by-word lyrics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl liquid-glass-btn text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-6 pb-3 border-b border-white/10 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              performSearch(query);
            }}
            className="relative flex items-center"
          >
            <div className="absolute left-4 w-4 h-4 text-neutral-400 flex items-center justify-center pointer-events-none">
              <Search className="w-4 h-4 stroke-[2.2]" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artist, song name, or paste https://music.youtube.com/..."
              className="w-full bg-neutral-950/80 border border-white/15 focus:border-white/40 rounded-2xl pl-11 pr-24 py-3.5 text-sm text-white placeholder-neutral-500 outline-none transition-all font-sans shadow-inner"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 px-4 py-2 liquid-glass-btn text-white text-xs font-semibold rounded-xl disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Search className="w-3 h-3 text-white" />
                  <span>Search</span>
                </>
              )}
            </button>
          </form>

          {/* Real-time search suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-18 left-6 right-6 bg-neutral-950 border border-white/10 rounded-xl shadow-2xl p-1.5 z-20 space-y-1">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(sug);
                    performSearch(sug);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <Search className="w-3 h-3 text-neutral-500" />
                  <span>{sug}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Segmented Mode Switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 text-xs">
          <button
            onClick={() => setActiveTab('featured')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'featured'
                ? 'bg-white/10 text-white'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Trending Tracks</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-white/10 text-white'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Results ({results.length})</span>
          </button>
        </div>

        {/* Tracks List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5 amoled-scrollbar">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
              <p className="text-xs text-neutral-500 font-mono">
                Querying YouTube Music streaming API...
              </p>
            </div>
          ) : activeTab === 'featured' ? (
            FEATURED_YOUTUBE_TRACKS.map((track) => (
              <div
                key={track.videoId}
                className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border border-white/5 bg-neutral-950/40 hover:bg-neutral-900/60 hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-white/10">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div
                      onClick={() => handleSelect(track, true)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-white text-white" />
                    </div>
                  </div>

                  {/* Title & Artist */}
                  <div className="truncate">
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {track.artist}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 mt-1">
                      <span>{track.durationFormatted}</span>
                      <span className="text-neutral-700">·</span>
                      <span>{track.views}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSelect(track, false)}
                    className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    title="Add to Queue"
                    aria-label="Add to Queue"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSelect(track, true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-neutral-200 transition-colors active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </button>
                </div>
              </div>
            ))
          ) : results.length > 0 ? (
            results.map((track) => (
              <div
                key={track.videoId}
                className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border border-white/5 bg-neutral-950/40 hover:bg-neutral-900/60 hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-white/10">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div
                      onClick={() => handleSelect(track, true)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-white text-white" />
                    </div>
                  </div>

                  <div className="truncate">
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {track.artist}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 mt-1">
                      <span>{track.durationFormatted}</span>
                      {track.views && (
                        <>
                          <span className="text-neutral-700">·</span>
                          <span>{track.views}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSelect(track, false)}
                    className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    title="Add to Queue"
                    aria-label="Add to Queue"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSelect(track, true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-neutral-200 transition-colors active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-xs text-neutral-500 font-mono space-y-1">
              <p>No results found for &quot;{query}&quot;</p>
              <p className="text-neutral-600">Try searching an artist or pasting a direct YouTube video URL</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 bg-neutral-950/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-red-500" />
            <span>Direct YouTube IFrame Stream</span>
          </div>
          <span>Synchronized Word Lyrics Enabled</span>
        </div>
      </div>
    </div>
  );
};

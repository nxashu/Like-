import React, { useState, useEffect } from 'react';
import { Search, Loader2, Play, Plus, Youtube, Radio } from 'lucide-react';
import { MOOD_CATEGORIES } from '../data/mockData.ts';
import { Song } from '../types.ts';

interface SearchViewProps {
  onPlaySong: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
  initialQuery?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({
  onPlaySong,
  onAddToQueue,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  // Suggestions
  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const t = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/youtube/suggestions?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const list = await res.json();
          setSuggestions(list.slice(0, 5));
        }
      } catch (err) {
        console.error('Suggestions error:', err);
      }
    }, 200);

    return () => clearTimeout(t);
  }, [query]);

  const performSearch = async (term: string) => {
    if (!term.trim()) return;
    setIsLoading(true);
    setSuggestions([]);

    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(term)}`);
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

  const handleSelectTrack = (item: any, playNow: boolean) => {
    // Generate initial word-by-word lyrics
    const sampleWords = [
      'Lost inside the music groove',
      'Feeling every subtle move',
      'The bass is pulsing in the night',
      'Underneath the neon light',
    ];
    const step = item.duration / (sampleWords.length + 1);
    const lyrics = sampleWords.map((line, idx) => {
      const start = Number(((idx + 0.5) * step).toFixed(2));
      const end = Number((start + step * 0.75).toFixed(2));
      const wordsArr = line.split(' ');
      const wDur = (end - start) / wordsArr.length;
      return {
        id: `yt-${idx}`,
        startTime: start,
        endTime: end,
        text: line,
        words: wordsArr.map((w, wIdx) => ({
          text: w,
          startTime: Number((start + wIdx * wDur).toFixed(2)),
          endTime: Number((start + (wIdx + 1) * wDur).toFixed(2)),
        })),
      };
    });

    const song: Song = {
      id: `yt-${item.videoId}`,
      title: item.title,
      artist: item.artist,
      album: item.album || 'YouTube Music',
      year: new Date().getFullYear().toString(),
      genre: 'YouTube Music Stream',
      duration: item.duration,
      quality: item.quality || 'YouTube 256kbps AAC',
      accentColor: '#ef4444',
      secondaryColor: '#f97316',
      coverStyle: {
        type: 'neon',
        baseGradient: 'from-red-950 to-black',
        accentGlow: 'rgba(239, 68, 68, 0.4)',
      },
      audioTrackId: 'youtube',
      youtubeVideoId: item.videoId,
      thumbnailUrl: item.thumbnail,
      views: item.views,
      lyrics,
    };

    if (playNow) {
      onPlaySong(song);
    } else {
      onAddToQueue(song);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-8 select-none pb-28">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Search
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Search songs, artists, albums, and playlists
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              performSearch(query);
            }}
            className="relative flex items-center"
          >
            <Search className="absolute left-4 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for artists, songs, albums, playlists..."
              className="w-full bg-neutral-950 border border-white/10 focus:border-red-500/60 rounded-2xl pl-11 pr-24 py-3.5 text-sm text-white placeholder-neutral-500 outline-none transition-all shadow-xl"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2.5 px-3.5 py-1.5 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 disabled:opacity-40 transition-colors"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-16 left-0 right-0 bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl p-2 z-20 space-y-1">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(sug);
                    performSearch(sug);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                >
                  <Search className="w-3 h-3 text-neutral-500" />
                  <span>{sug}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white tracking-tight">
            Results ({results.length})
          </h3>
          <div className="space-y-2">
            {results.map((track) => (
              <div
                key={track.videoId}
                className="group flex items-center justify-between p-3 rounded-2xl bg-neutral-950/70 border border-white/5 hover:border-white/20 hover:bg-neutral-900/60 transition-all cursor-pointer"
              >
                <div
                  onClick={() => handleSelectTrack(track, true)}
                  className="flex items-center gap-3.5 min-w-0 flex-1"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-white/10">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-5 h-5 fill-white text-white" />
                    </div>
                  </div>

                  <div className="truncate pr-2">
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
                    onClick={() => handleSelectTrack(track, false)}
                    className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    title="Add to queue"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSelectTrack(track, true)}
                    className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    Play
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Moods & Moments Grids (Screenshot 6) */
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white tracking-tight">Moods & moments</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOOD_CATEGORIES.map((mood) => (
              <div
                key={mood.id}
                onClick={() => {
                  setQuery(mood.name);
                  performSearch(mood.name);
                }}
                className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r ${mood.gradient} cursor-pointer hover:opacity-90 transition-opacity h-24 flex flex-col justify-between shadow-lg`}
              >
                <span className="text-sm font-bold text-white tracking-tight drop-shadow">
                  {mood.name}
                </span>
                <span className="self-end text-[10px] font-mono text-white/80 bg-black/30 px-2 py-0.5 rounded-full">
                  Tap to search
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

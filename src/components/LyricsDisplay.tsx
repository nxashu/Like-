import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Play, ArrowDown, Type, Volume2 } from 'lucide-react';
import { LyricLine, LyricWord, Song } from '../types.ts';

interface LyricsDisplayProps {
  song: Song;
  currentTime: number;
  isPlaying: boolean;
  onSeek: (seconds: number) => void;
  variant?: 'full' | 'side' | 'ticker';
}

export const LyricsDisplay: React.FC<LyricsDisplayProps> = ({
  song,
  currentTime,
  isPlaying,
  onSeek,
  variant = 'side',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Auto-scroll state
  const [userIsScrolling, setUserIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('large');

  // Identify active lyric line
  const activeLineIndex = useMemo(() => {
    if (!song.lyrics || song.lyrics.length === 0) return -1;
    
    // Find the line that covers currentTime
    const foundIdx = song.lyrics.findIndex(
      (line) => currentTime >= line.startTime - 0.25 && currentTime <= line.endTime + 0.3
    );
    if (foundIdx !== -1) return foundIdx;

    // Otherwise find the latest line before currentTime
    let latestIdx = -1;
    for (let i = 0; i < song.lyrics.length; i++) {
      if (currentTime >= song.lyrics[i].startTime) {
        latestIdx = i;
      }
    }
    return latestIdx;
  }, [song.lyrics, currentTime]);

  const activeLine = activeLineIndex !== -1 ? song.lyrics[activeLineIndex] : null;

  // Auto-scroll to center active line unless user manually scrolled
  useEffect(() => {
    if (userIsScrolling || activeLineIndex === -1) return;

    const currentLineEl = lineRefs.current[song.lyrics[activeLineIndex]?.id];
    if (currentLineEl && containerRef.current) {
      currentLineEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLineIndex, userIsScrolling, song.lyrics]);

  // Handle user manual scroll
  const handleScroll = () => {
    setUserIsScrolling(true);
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    // Resume auto-scroll after 3.5 seconds of scroll inactivity
    scrollTimeoutRef.current = window.setTimeout(() => {
      setUserIsScrolling(false);
    }, 3500);
  };

  const resumeAutoSync = () => {
    setUserIsScrolling(false);
    if (activeLineIndex !== -1) {
      const currentLineEl = lineRefs.current[song.lyrics[activeLineIndex]?.id];
      if (currentLineEl) {
        currentLineEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  };

  // Minimalist single-line ticker variant (for main player view)
  if (variant === 'ticker') {
    if (!activeLine) {
      return (
        <div className="h-10 flex items-center justify-center text-xs text-neutral-600 font-mono tracking-wide">
          <span>Instrumental intro</span>
        </div>
      );
    }

    return (
      <div className="h-12 flex items-center justify-center px-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm sm:text-base font-medium">
          {activeLine.words.map((word, wIdx) => {
            const isDone = currentTime >= word.endTime;
            const isCurrent = currentTime >= word.startTime && currentTime < word.endTime;
            const wordProgress = isCurrent
              ? Math.max(0, Math.min(1, (currentTime - word.startTime) / (word.endTime - word.startTime)))
              : isDone ? 1 : 0;

            return (
              <span
                key={wIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  onSeek(word.startTime);
                }}
                className={`cursor-pointer transition-all duration-100 ${
                  isDone
                    ? 'text-white'
                    : isCurrent
                    ? 'text-white scale-[1.05]'
                    : 'text-neutral-600'
                }`}
                style={
                  isCurrent
                    ? {
                        backgroundImage: `linear-gradient(to right, #ffffff ${wordProgress * 100}%, rgba(115, 115, 115, 0.4) ${wordProgress * 100}%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: `0 0 12px ${song.accentColor}80`,
                      }
                    : undefined
                }
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // Full or side panel word-by-word lyrics
  const textSizeClass =
    fontSize === 'xl'
      ? 'text-3xl sm:text-4xl md:text-5xl leading-tight'
      : fontSize === 'large'
      ? 'text-2xl sm:text-3xl md:text-4xl leading-tight'
      : 'text-xl sm:text-2xl md:text-3xl leading-snug';

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-black select-none">
      {/* Top Lyric Bar Utilities */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 text-xs text-neutral-500 z-10 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-mono text-[11px] tracking-wide text-neutral-400">
            {activeLine ? `Live Lyric · ${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')}` : 'Word Sync Active'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Font Size Selector */}
          <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 text-[10px] rounded font-medium transition-colors ${
                fontSize === 'normal' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                fontSize === 'large' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xl')}
              className={`px-2 py-0.5 text-sm rounded font-medium transition-colors ${
                fontSize === 'xl' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              A++
            </button>
          </div>
        </div>
      </div>

      {/* Floating "Sync playback" pill-less button if user scrolled away */}
      {userIsScrolling && (
        <button
          onClick={resumeAutoSync}
          className="absolute top-14 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/15 rounded-full text-xs font-medium text-white shadow-xl hover:bg-neutral-800 transition-all active:scale-95 animate-fade-in"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Sync lyrics with audio</span>
        </button>
      )}

      {/* Lyric Lines Scrollable Viewport */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 sm:px-10 py-24 sm:py-32 space-y-8 sm:space-y-12 amoled-scrollbar scroll-smooth"
      >
        {song.lyrics.map((line, lIdx) => {
          const isActive = lIdx === activeLineIndex;
          const isPast = activeLineIndex !== -1 && lIdx < activeLineIndex;

          return (
            <div
              key={line.id}
              ref={(el) => {
                lineRefs.current[line.id] = el;
              }}
              onClick={() => onSeek(line.startTime)}
              className={`group cursor-pointer transition-all duration-300 py-1.5 px-2 rounded-xl ${
                isActive
                  ? 'opacity-100'
                  : isPast
                  ? 'opacity-25 hover:opacity-75 blur-[0.3px] hover:blur-none'
                  : 'opacity-35 hover:opacity-85'
              }`}
            >
              {/* Word-by-Word Synchronized Rendering */}
              <div
                className={`font-bold tracking-tight transition-all duration-200 flex flex-wrap items-baseline gap-x-2.5 sm:gap-x-3.5 gap-y-1 ${textSizeClass} ${
                  isActive ? 'scale-[1.01]' : 'scale-100'
                }`}
              >
                {line.words.map((word, wIdx) => {
                  const isWordDone = currentTime >= word.endTime;
                  const isWordActive = currentTime >= word.startTime && currentTime < word.endTime;
                  
                  // Compute progressive karaoke sweep between 0 and 1
                  const progress = isWordActive
                    ? Math.max(0, Math.min(1, (currentTime - word.startTime) / Math.max(0.01, word.endTime - word.startTime)))
                    : isWordDone
                    ? 1
                    : 0;

                  return (
                    <span
                      key={wIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSeek(word.startTime);
                      }}
                      className={`relative inline-block transition-transform duration-100 hover:scale-105 active:scale-95 ${
                        !isActive
                          ? isPast
                            ? 'text-neutral-500'
                            : 'text-neutral-500'
                          : isWordDone
                          ? 'text-white'
                          : isWordActive
                          ? 'text-white'
                          : 'text-neutral-600'
                      }`}
                      style={
                        isActive && isWordActive
                          ? {
                              backgroundImage: `linear-gradient(to right, #ffffff ${progress * 100}%, rgba(115, 115, 115, 0.45) ${progress * 100}%)`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              filter: `drop-shadow(0 0 16px ${song.accentColor}99)`,
                            }
                          : undefined
                      }
                      title={`Jump to ${word.startTime}s`}
                    >
                      {word.text}
                    </span>
                  );
                })}
              </div>

              {/* Line timestamp trigger affordance on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>
                  {Math.floor(line.startTime / 60)}:
                  {Math.floor(line.startTime % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-neutral-700">·</span>
                <span className="text-neutral-500">Click word or line to jump</span>
              </div>
            </div>
          );
        })}

        {/* Bottom padding spacer to allow smooth center scrolling of last line */}
        <div className="h-40" />
      </div>

      {/* Subtle Bottom Ambient Fade Out */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />
      <div className="pointer-events-none absolute top-10 left-0 right-0 h-12 bg-gradient-to-b from-black to-transparent" />
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Plus,
  Star,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  FileText,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { Song, UIStyle, RepeatMode } from '../types.ts';
import { AlbumArt } from './AlbumArt.tsx';

interface NowPlayingExpandedProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
}

export const NowPlayingExpanded: React.FC<NowPlayingExpandedProps> = ({
  isOpen,
  onClose,
  song,
  isPlaying,
  currentTime,
  duration,
  volume,
  repeatMode,
  isShuffled,
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onCycleRepeat,
}) => {
  const [uiStyle, setUiStyle] = useState<UIStyle>('liquidGlass');
  const [showLyrics, setShowLyrics] = useState(false);
  const [showRomanization, setShowRomanization] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [ambientGlow, setAmbientGlow] = useState(true);

  const scrubberRef = useRef<HTMLDivElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Time format
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Scrub click handler
  const handleScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberRef.current) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * duration);
  };

  // Find active lyric line
  const activeLineIndex = song.lyrics.findIndex(
    (line) => currentTime >= line.startTime - 0.2 && currentTime <= line.endTime + 0.3
  );

  // Material 3 Expressive Squiggly SVG Generator
  const renderWavyPath = (pct: number) => {
    const width = 340;
    const activeWidth = (pct / 100) * width;
    
    // Generate sine wave points
    let d = `M 0 10 `;
    for (let x = 0; x <= activeWidth; x += 10) {
      const y = 10 + Math.sin(x * 0.15) * 4;
      d += `L ${x} ${y} `;
    }

    return (
      <svg className="w-full h-8 overflow-visible" viewBox={`0 0 ${width} 20`}>
        {/* Inactive straight track */}
        <line x1="0" y1="10" x2={width} y2="10" stroke="#333333" strokeWidth="4" strokeLinecap="round" />
        {/* Active squiggly wave */}
        <path d={d} fill="none" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
        {/* Scrubber Knob */}
        <circle cx={activeWidth} cy="10" r="7" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white select-none overflow-y-auto amoled-scrollbar animate-slide-up">
      {/* Dynamic Fluid Caustic Mesh Backdrop for Liquid Glass Style */}
      {uiStyle === 'liquidGlass' ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Fluid Caustic Blobs */}
          <div
            className="absolute -top-24 -left-24 w-[380px] h-[380px] rounded-full blur-[80px] opacity-45 animate-liquid-1"
            style={{ backgroundColor: song.accentColor }}
          />
          <div
            className="absolute top-1/3 -right-20 w-[350px] h-[350px] rounded-full blur-[90px] opacity-35 animate-liquid-2"
            style={{ backgroundColor: song.secondaryColor }}
          />
          <div
            className="absolute -bottom-20 left-1/4 w-[420px] h-[420px] rounded-full blur-[100px] opacity-30 animate-liquid-pulse"
            style={{ backgroundColor: song.accentColor }}
          />

          {/* Frosted Glass Overlay */}
          {song.thumbnailUrl && (
            <img
              src={song.thumbnailUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-3xl scale-150 opacity-20"
            />
          )}
          <div className="absolute inset-0 bg-black/65 backdrop-blur-3xl" />
          
          {/* Subtle Diagonal Specular Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-white/[0.05] pointer-events-none" />
        </div>
      ) : uiStyle === 'material3' ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-b from-neutral-900 to-black opacity-90" />
      ) : null}

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-5 pb-3">
        <button
          onClick={onClose}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl transition-all cursor-pointer ${
            uiStyle === 'liquidGlass' ? 'liquid-glass-btn text-white' : 'text-neutral-400 hover:text-white'
          }`}
          aria-label="Collapse player"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        {/* Center Title or Album Title */}
        <div className="text-center truncate max-w-[220px]">
          <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Now Playing</p>
          <p className="text-xs font-semibold text-white truncate drop-shadow">{song.album}</p>
        </div>

        {/* Right Menu Icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAdded(!isAdded)}
            className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-all cursor-pointer ${
              isAdded
                ? 'text-emerald-400 liquid-glass-btn'
                : uiStyle === 'liquidGlass'
                ? 'liquid-glass-btn text-neutral-300'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Add to Playlist"
            aria-label="Add to Playlist"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-all cursor-pointer ${
              isFavorite
                ? 'text-amber-300 liquid-glass-btn'
                : uiStyle === 'liquidGlass'
                ? 'liquid-glass-btn text-neutral-300'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Favorite"
            aria-label="Favorite"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Center Area: Large Album Art OR Word-by-Word Lyrics View */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-2 max-w-lg mx-auto w-full">
        {!showLyrics ? (
          /* Large Album Artwork Screen */
          <div className="w-full flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <AlbumArt
                song={song}
                isPlaying={isPlaying}
                ambientGlow={ambientGlow}
                onToggleGlow={() => setAmbientGlow(!ambientGlow)}
                size="large"
              />
              {/* Liquid Glass Pedestal Ring */}
              {uiStyle === 'liquidGlass' && (
                <div className="absolute -bottom-3 inset-x-8 h-4 rounded-full bg-white/10 blur-md pointer-events-none" />
              )}
            </div>

            {/* Quick 1-line lyric preview ticker */}
            {activeLineIndex !== -1 && (
              <div
                onClick={() => setShowLyrics(true)}
                className={`w-full text-center py-2.5 px-4 rounded-2xl cursor-pointer transition-all ${
                  uiStyle === 'liquidGlass'
                    ? 'liquid-glass-pill hover:border-white/30 hover:scale-[1.01]'
                    : 'bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
              >
                <p className="text-xs font-semibold text-white truncate">
                  {song.lyrics[activeLineIndex].text}
                </p>
                {song.lyrics[activeLineIndex].romanization && (
                  <p className="text-[10px] text-neutral-400 font-mono truncate mt-0.5">
                    {song.lyrics[activeLineIndex].romanization}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Synchronized Word-by-Word Lyrics with Liquid Glass Aesthetics */
          <div
            className={`w-full h-[360px] sm:h-[420px] rounded-3xl p-5 flex flex-col overflow-hidden transition-all ${
              uiStyle === 'liquidGlass'
                ? 'liquid-glass-card shadow-[0_24px_60px_rgba(0,0,0,0.8)] border-white/20'
                : 'bg-neutral-950/80 border border-white/10 backdrop-blur-xl'
            }`}
          >
            {/* Header controls for lyrics */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-neutral-400">
              <span className="font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Synced Lyrics</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRomanization(!showRomanization)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] transition-colors cursor-pointer ${
                    showRomanization
                      ? 'bg-white/25 text-white font-semibold shadow-sm'
                      : 'text-neutral-500 hover:text-white'
                  }`}
                  title="Toggle Romanization"
                >
                  Rom
                </button>
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] transition-colors cursor-pointer ${
                    showTranslation
                      ? 'bg-white/25 text-white font-semibold shadow-sm'
                      : 'text-neutral-500 hover:text-white'
                  }`}
                  title="Toggle Translation"
                >
                  Trans
                </button>
                <button
                  onClick={() => setShowLyrics(false)}
                  className="px-2.5 py-1 rounded-lg text-[10px] text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Artwork
                </button>
              </div>
            </div>

            {/* Scrollable Lyric Lines */}
            <div
              ref={lyricsContainerRef}
              className="flex-1 overflow-y-auto py-6 space-y-6 amoled-scrollbar"
            >
              {song.lyrics.length > 0 ? (
                song.lyrics.map((line, idx) => {
                  const isActive = idx === activeLineIndex;
                  const isPast = activeLineIndex !== -1 && idx < activeLineIndex;

                  return (
                    <div
                      key={line.id}
                      onClick={() => onSeek(line.startTime)}
                      className={`cursor-pointer transition-all duration-200 py-1 ${
                        isActive
                          ? 'opacity-100 scale-102 drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]'
                          : isPast
                          ? 'opacity-30 hover:opacity-70'
                          : 'opacity-40 hover:opacity-80'
                      }`}
                    >
                      {/* Original Line (Word-by-word active highlight) */}
                      <div className="text-xl sm:text-2xl font-bold tracking-tight flex flex-wrap items-baseline gap-x-2">
                        {line.words.map((word, wIdx) => {
                          const isDone = currentTime >= word.endTime;
                          const isWordActive = currentTime >= word.startTime && currentTime < word.endTime;
                          const progress = isWordActive
                            ? Math.max(0, Math.min(1, (currentTime - word.startTime) / Math.max(0.01, word.endTime - word.startTime)))
                            : isDone ? 1 : 0;

                          return (
                            <span
                              key={wIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSeek(word.startTime);
                              }}
                              className={`transition-colors duration-100 ${
                                isActive && isWordActive
                                  ? 'text-white font-extrabold'
                                  : isDone || (isActive && isDone)
                                  ? 'text-white'
                                  : 'text-neutral-600'
                              }`}
                              style={
                                isActive && isWordActive
                                  ? {
                                      backgroundImage: `linear-gradient(to right, #ffffff ${progress * 100}%, rgba(140, 140, 140, 0.4) ${progress * 100}%)`,
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                      textShadow: `0 0 20px ${song.accentColor || '#ffffff'}90`,
                                    }
                                  : undefined
                              }
                            >
                              {word.text}
                            </span>
                          );
                        })}
                      </div>

                      {/* Romanization Sub-line */}
                      {showRomanization && line.romanization && (
                        <p className={`text-xs font-mono mt-1 ${isActive ? 'text-neutral-200' : 'text-neutral-600'}`}>
                          {line.romanization}
                        </p>
                      )}

                      {/* Translation Sub-line */}
                      {showTranslation && line.translation && (
                        <p className={`text-xs italic mt-0.5 ${isActive ? 'text-neutral-300' : 'text-neutral-600'}`}>
                          {line.translation}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center text-xs text-neutral-500 font-mono">
                  No timed lyrics loaded for this track.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Track Title, Artist, & Format Pill */}
        <div className="w-full flex items-center justify-between mt-5 px-1">
          <div className="truncate pr-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate drop-shadow">
              {song.title}
            </h2>
            <p className="text-sm text-neutral-300 font-medium truncate mt-0.5">
              {song.artist}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Quality Chip / Capsule */}
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide ${
                uiStyle === 'liquidGlass'
                  ? 'liquid-glass-pill text-white/90'
                  : 'bg-white/10 text-neutral-300 border border-white/10'
              }`}
            >
              {song.audioTrackId === 'youtube' ? 'AAC 256k' : 'Lossless'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Controls Panel */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 pb-8 pt-2 space-y-4">
        {/* Scrubber Timeline */}
        <div className="w-full space-y-1">
          {uiStyle === 'material3' ? (
            /* Material 3 Expressive Squiggly Waveform */
            <div
              ref={scrubberRef}
              onClick={handleScrubClick}
              className="cursor-pointer py-1"
            >
              {renderWavyPath(progressPercent)}
            </div>
          ) : uiStyle === 'liquidGlass' ? (
            /* Liquid Glass Fluid Stream Scrubber */
            <div
              ref={scrubberRef}
              onClick={handleScrubClick}
              className="relative w-full h-5 flex items-center cursor-pointer group"
            >
              {/* Glass Trough Channel */}
              <div className="w-full h-2 bg-white/10 border border-white/15 rounded-full overflow-hidden backdrop-blur-md relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                {/* Flowing Liquid Stream */}
                <div
                  className="h-full bg-gradient-to-r from-white via-neutral-100 to-white rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {/* Translucent Glass Bead Scrubber Knob */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full liquid-glass-btn pointer-events-none group-hover:scale-125 transition-transform flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                style={{ left: `calc(${progressPercent}% - 8px)` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          ) : (
            /* Clean Minimalist Scrubber Line */
            <div
              ref={scrubberRef}
              onClick={handleScrubClick}
              className="relative w-full h-4 flex items-center cursor-pointer group"
            >
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-75"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg pointer-events-none"
                style={{ left: `calc(${progressPercent}% - 7px)` }}
              />
            </div>
          )}

          {/* Timestamps */}
          <div className="flex justify-between text-xs font-mono text-neutral-400 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
          </div>
        </div>

        {/* Primary Playback Transport Buttons */}
        <div className="flex items-center justify-between gap-4 py-1">
          {/* Shuffle Button */}
          <button
            onClick={onToggleShuffle}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl transition-all cursor-pointer ${
              uiStyle === 'liquidGlass'
                ? isShuffled
                  ? 'liquid-glass-btn text-white shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                  : 'liquid-glass-btn text-neutral-400 hover:text-white'
                : isShuffled
                ? 'text-white'
                : 'text-neutral-500 hover:text-white'
            }`}
            title="Shuffle"
            aria-label="Toggle Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          {/* Previous Track */}
          <button
            onClick={onPrevious}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl transition-all active:scale-95 cursor-pointer ${
              uiStyle === 'liquidGlass'
                ? 'liquid-glass-btn text-white'
                : 'text-white hover:text-neutral-200'
            }`}
            title="Previous"
            aria-label="Previous Track"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={onPlayPause}
            className={`flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
              uiStyle === 'material3'
                ? 'w-24 h-14 rounded-3xl bg-rose-500 text-white hover:bg-rose-600 shadow-xl'
                : uiStyle === 'liquidGlass'
                ? 'w-16 h-16 rounded-full liquid-glass-play-btn text-black'
                : 'w-16 h-16 rounded-full bg-white text-black hover:scale-105 shadow-xl'
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={onNext}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl transition-all active:scale-95 cursor-pointer ${
              uiStyle === 'liquidGlass'
                ? 'liquid-glass-btn text-white'
                : 'text-white hover:text-neutral-200'
            }`}
            title="Next"
            aria-label="Next Track"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>

          {/* Repeat Button */}
          <button
            onClick={onCycleRepeat}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl transition-all cursor-pointer ${
              uiStyle === 'liquidGlass'
                ? repeatMode !== 'off'
                  ? 'liquid-glass-btn text-white shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                  : 'liquid-glass-btn text-neutral-400 hover:text-white'
                : repeatMode !== 'off'
                ? 'text-white'
                : 'text-neutral-500 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
            aria-label="Cycle Repeat"
          >
            {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          </button>
        </div>

        {/* Bottom Utility Bar: Lyrics Toggle & Volume */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-neutral-400">
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className={`min-h-[44px] px-3.5 flex items-center gap-2 rounded-xl transition-all cursor-pointer ${
              showLyrics
                ? 'liquid-glass-btn text-white font-medium shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                : 'liquid-glass-btn text-neutral-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs">Lyrics</span>
          </button>

          {/* Volume Mini Slider */}
          <div className="flex items-center gap-2 liquid-glass-pill px-3.5 py-2 rounded-xl">
            <Volume2 className="w-4 h-4 text-white/80" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

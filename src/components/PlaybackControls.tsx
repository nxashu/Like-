import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Timer,
  SlidersHorizontal,
  Maximize2,
  ListMusic,
  FileText,
} from 'lucide-react';
import { RepeatMode, ViewMode, Song } from '../types.ts';

interface PlaybackControlsProps {
  song: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  playbackRate: number;
  viewMode: ViewMode;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onChangePlaybackRate: (rate: number) => void;
  onChangeViewMode: (mode: ViewMode) => void;
  onToggleQueue: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  song,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  repeatMode,
  isShuffled,
  playbackRate,
  viewMode,
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onCycleRepeat,
  onChangePlaybackRate,
  onChangeViewMode,
  onToggleQueue,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const [hoverPositionRatio, setHoverPositionRatio] = useState<number>(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSleepTimerMenu, setShowSleepTimerMenu] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);

  const progressBarRef = useRef<HTMLDivElement>(null);

  // Time format helper (MM:SS)
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Scrub bar interaction
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, hoverX / rect.width));
    setHoverPositionRatio(ratio);
    setHoverSeekTime(ratio * duration);
  };

  const handleProgressMouseLeave = () => {
    setHoverSeekTime(null);
  };

  // Sleep timer handler
  const setTimer = (mins: number | null) => {
    setSleepTimerMinutes(mins);
    setShowSleepTimerMenu(false);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentVol = isMuted ? 0 : volume;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col gap-4 select-none">
      {/* 1. Scrubber Progress Timeline */}
      <div className="w-full flex flex-col gap-1.5 group">
        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          onMouseMove={handleProgressMouseMove}
          onMouseLeave={handleProgressMouseLeave}
          className="relative w-full h-4 sm:h-5 flex items-center cursor-pointer"
        >
          {/* Background Track Bar */}
          <div className="w-full h-1 sm:h-1.5 bg-neutral-900 rounded-full overflow-hidden transition-all duration-150 group-hover:h-2">
            {/* Active Progress Bar */}
            <div
              className="h-full bg-white rounded-full transition-all duration-75 relative"
              style={{
                width: `${progressPercent}%`,
                boxShadow: isPlaying ? `0 0 10px ${song.accentColor}90` : 'none',
              }}
            />
          </div>

          {/* Hover Scrubbing Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none scale-0 group-hover:scale-100"
            style={{
              left: `calc(${progressPercent}% - 7px)`,
            }}
          />

          {/* Hover Timestamp Tooltip */}
          {hoverSeekTime !== null && (
            <div
              className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 bg-neutral-900 border border-white/20 rounded text-[10px] font-mono text-white pointer-events-none shadow-xl"
              style={{
                left: `${hoverPositionRatio * 100}%`,
              }}
            >
              {formatTime(hoverSeekTime)}
            </div>
          )}
        </div>

        {/* Timestamps in Tabular Monospace */}
        <div className="flex items-center justify-between text-xs font-mono text-neutral-500 tabular-nums px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span className="opacity-70">-{formatTime(Math.max(0, duration - currentTime))}</span>
        </div>
      </div>

      {/* 2. Main Playback Controls Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Left Slot: Secondary Controls (Like, Speed, Sleep Timer) */}
        <div className="flex items-center gap-3 w-1/4 justify-start">
          {/* Like Heart Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors ${
              isLiked ? 'text-rose-500' : 'text-neutral-500 hover:text-white'
            }`}
            title={isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
            aria-label="Favorite"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current scale-110' : ''} transition-transform`} />
          </button>

          {/* Playback Speed Controller */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="min-h-[44px] px-2.5 flex items-center justify-center text-xs font-mono text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              title="Playback speed"
            >
              <span>{playbackRate}x</span>
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-12 left-0 bg-neutral-950 border border-white/10 rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 z-30 min-w-[70px]">
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      onChangePlaybackRate(rate);
                      setShowSpeedMenu(false);
                    }}
                    className={`px-3 py-1 text-xs font-mono rounded text-left transition-colors ${
                      playbackRate === rate ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sleep Timer */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowSleepTimerMenu(!showSleepTimerMenu)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors ${
                sleepTimerMinutes !== null ? 'text-white bg-white/10' : 'text-neutral-500 hover:text-white'
              }`}
              title="Sleep timer"
            >
              <Timer className="w-4 h-4" />
            </button>
            {showSleepTimerMenu && (
              <div className="absolute bottom-12 left-0 bg-neutral-950 border border-white/10 rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 z-30 min-w-[120px]">
                <span className="text-[10px] uppercase font-mono text-neutral-500 px-3 py-1">Sleep Timer</span>
                {[
                  { label: 'Off', val: null },
                  { label: '15 Minutes', val: 15 },
                  { label: '30 Minutes', val: 30 },
                  { label: '45 Minutes', val: 45 },
                  { label: 'End of Track', val: 0 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setTimer(item.val)}
                    className={`px-3 py-1.5 text-xs text-left rounded transition-colors ${
                      sleepTimerMinutes === item.val ? 'bg-white text-black font-medium' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Slot: Subtle Minimalist Primary Transport Buttons */}
        <div className="flex items-center gap-4 sm:gap-6 justify-center">
          {/* Shuffle Button */}
          <button
            onClick={onToggleShuffle}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors ${
              isShuffled ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title={`Shuffle: ${isShuffled ? 'On' : 'Off'}`}
            aria-label="Toggle Shuffle"
          >
            <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Previous Track */}
          <button
            onClick={onPrevious}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-neutral-300 hover:text-white transition-colors active:scale-95"
            title="Previous Track"
            aria-label="Previous Track"
          >
            <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          </button>

          {/* Primary Play/Pause Tactile Circle Button */}
          <button
            onClick={onPlayPause}
            className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_24px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={onNext}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-neutral-300 hover:text-white transition-colors active:scale-95"
            title="Next Track"
            aria-label="Next Track"
          >
            <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          </button>

          {/* Repeat Button */}
          <button
            onClick={onCycleRepeat}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors ${
              repeatMode !== 'off' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title={`Repeat: ${repeatMode}`}
            aria-label="Cycle Repeat"
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        {/* Right Slot: Volume & View Mode Switches */}
        <div className="flex items-center gap-2 sm:gap-4 w-1/4 justify-end">
          {/* Volume Control Bar */}
          <div className="hidden sm:flex items-center gap-2 group">
            <button
              onClick={onToggleMute}
              className="text-neutral-500 hover:text-white transition-colors min-h-[44px] min-w-[36px] flex items-center justify-center"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {currentVol === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : currentVol < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={currentVol}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
              aria-label="Volume Slider"
            />
          </div>

          {/* Lyrics View Switch */}
          <button
            onClick={() => onChangeViewMode(viewMode === 'lyrics' ? 'player' : 'lyrics')}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors ${
              viewMode === 'lyrics' ? 'text-white bg-white/10' : 'text-neutral-500 hover:text-white'
            }`}
            title="Word-by-word Lyrics View"
            aria-label="Toggle Lyrics View"
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Queue Drawer Trigger */}
          <button
            onClick={onToggleQueue}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-neutral-500 hover:text-white transition-colors"
            title="Playback Queue"
            aria-label="Toggle Queue"
          >
            <ListMusic className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

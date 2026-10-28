import React from 'react';
import { Play, Pause, Heart, SkipForward, Disc } from 'lucide-react';
import { Song } from '../types.ts';

interface MiniPlayerProps {
  song: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onNext: () => void;
  onExpand: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  song,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onExpand,
}) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 px-3 sm:px-6 select-none pointer-events-none">
      <div
        onClick={onExpand}
        className="max-w-2xl mx-auto liquid-glass-card rounded-2xl p-2 sm:p-2.5 flex items-center justify-between cursor-pointer hover:border-white/25 transition-all pointer-events-auto relative overflow-hidden group"
      >
        {/* Ambient Liquid Color Backglow */}
        <div
          className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: song.accentColor }}
        />
        <div
          className="absolute -left-10 -top-10 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: song.secondaryColor }}
        />

        {/* Top Liquid Progress Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-white via-white to-neutral-300 transition-all duration-100 shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Left: Thumbnail & Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black shrink-0 border border-white/20 shadow-md flex items-center justify-center">
            {song.thumbnailUrl ? (
              <img
                src={song.thumbnailUrl}
                alt={song.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: song.accentColor }}
              >
                <Disc className={`w-5 h-5 text-white/90 ${isPlaying ? 'animate-spin' : ''}`} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </div>

          <div className="truncate pr-2">
            <h4 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-neutral-100 transition-colors">
              {song.title}
            </h4>
            <p className="text-[11px] text-neutral-400 truncate">
              {song.artist}
            </p>
          </div>
        </div>

        {/* Right: Liquid Glass Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 relative z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-all cursor-pointer ${
              isLiked ? 'text-rose-400 liquid-glass-btn' : 'text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Favorite"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayPause();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full liquid-glass-play-btn text-black flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Next track"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

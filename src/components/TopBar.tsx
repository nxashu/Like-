import React from 'react';
import { ListMusic } from 'lucide-react';
import { ViewMode } from '../types.ts';

interface TopBarProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onOpenQueue: () => void;
  onOpenYouTubeModal: () => void;
  onToggleUpload: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  onChangeViewMode,
  onOpenQueue,
  onOpenYouTubeModal,
  onToggleUpload,
}) => {
  return (
    <header className="w-full flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-10 py-3.5 border-b border-white/10 bg-black/50 backdrop-blur-2xl sticky top-0 z-40 select-none shadow-[0_4px_30px_rgba(0,0,0,0.5),inset_0_-1px_0_rgba(255,255,255,0.06)]">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onChangeViewMode('player');
        }}
        className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity flex items-center gap-2 group"
      >
        <span className="bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
          nxmusic
        </span>
      </a>

      {/* Zone 2: 4 clean single-line navigation links */}
      <nav className="hidden md:flex items-center gap-6 md:gap-8 text-xs font-medium text-neutral-400">
        <button
          onClick={() => onChangeViewMode('player')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            viewMode === 'player' ? 'text-white' : ''
          }`}
        >
          Player
        </button>
        <button
          onClick={() => onChangeViewMode('split')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            viewMode === 'split' ? 'text-white' : ''
          }`}
        >
          Split View
        </button>
        <button
          onClick={() => onChangeViewMode('lyrics')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            viewMode === 'lyrics' ? 'text-white' : ''
          }`}
        >
          Lyrics
        </button>
        <button
          onClick={onOpenYouTubeModal}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-neutral-300"
        >
          <span>YouTube Music</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action - Queue Drawer */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenQueue}
          className="liquid-glass-btn px-4 py-2 text-xs font-semibold text-white rounded-xl hover:border-white/40 whitespace-nowrap shrink-0 active:scale-95 flex items-center gap-2 cursor-pointer"
          title="Open Queue"
          aria-label="Open Queue"
        >
          <ListMusic className="w-3.5 h-3.5 text-white/90" />
          <span>Queue</span>
        </button>
      </div>
    </header>
  );
};


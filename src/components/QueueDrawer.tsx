import React, { useRef } from 'react';
import { X, Play, Music, Upload, Check, Radio } from 'lucide-react';
import { Song } from '../types.ts';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  currentSongIndex: number;
  isPlaying: boolean;
  onSelectSong: (index: number) => void;
  onUploadCustomTrack: (file: File) => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  songs,
  currentSongIndex,
  isPlaying,
  onSelectSong,
  onUploadCustomTrack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadCustomTrack(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="w-full max-w-md bg-black border-l border-white/10 h-full flex flex-col justify-between shadow-2xl p-6 sm:p-8 animate-slide-left select-none">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">Playback Queue</h2>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                {songs.length} Tracks In Rotation
              </p>
            </div>
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-neutral-400 hover:text-white transition-colors"
              aria-label="Close Queue"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Track List */}
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] amoled-scrollbar pr-1">
            {songs.map((song, idx) => {
              const isCurrent = idx === currentSongIndex;

              return (
                <div
                  key={song.id}
                  onClick={() => onSelectSong(idx)}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-white/10 text-white'
                      : 'hover:bg-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Track Indicator / Index */}
                    <div className="w-6 text-center font-mono text-xs text-neutral-500 flex items-center justify-center">
                      {isCurrent && isPlaying ? (
                        <div className="flex items-end gap-0.5 h-3.5">
                          <span className="w-0.5 h-full bg-white animate-pulse" />
                          <span className="w-0.5 h-2/3 bg-white animate-pulse" />
                          <span className="w-0.5 h-4/5 bg-white animate-pulse" />
                        </div>
                      ) : (
                        <span className="group-hover:hidden">{(idx + 1).toString().padStart(2, '0')}</span>
                      )}
                      <Play className="w-3.5 h-3.5 hidden group-hover:block fill-current text-white" />
                    </div>

                    {/* Track Titles */}
                    <div className="truncate">
                      <p className={`text-sm truncate font-medium ${isCurrent ? 'text-white' : 'text-neutral-300'}`}>
                        {song.title}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Track Duration & Format */}
                  <div className="text-right pl-3 shrink-0">
                    <span className="text-xs font-mono tabular-nums text-neutral-500">
                      {Math.floor(song.duration / 60)}:
                      {Math.floor(song.duration % 60).toString().padStart(2, '0')}
                    </span>
                    <p className="text-[10px] font-mono text-neutral-600 truncate max-w-[80px]">
                      {song.audioTrackId === 'custom' ? 'Custom' : 'Lossless'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Track Uploader Footer */}
        <div className="border-t border-white/10 pt-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 text-xs font-medium text-neutral-300 hover:text-white transition-all active:scale-[0.99]"
          >
            <Upload className="w-4 h-4" />
            <span>Load Your Own Audio (MP3 / WAV)</span>
          </button>
          <p className="text-[11px] text-neutral-600 text-center mt-2 font-mono">
            Pure client-side streaming · Zero data sent to cloud
          </p>
        </div>
      </div>
    </div>
  );
};

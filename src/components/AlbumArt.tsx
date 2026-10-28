import React, { useState, useEffect, useRef } from 'react';
import { Disc3, Sparkles, Maximize2, Tv, Image as ImageIcon } from 'lucide-react';
import { Song } from '../types.ts';
import { youtubeEngine } from '../utils/youtubePlayer.ts';

interface AlbumArtProps {
  song: Song;
  isPlaying: boolean;
  ambientGlow: boolean;
  onToggleGlow: () => void;
  size?: 'normal' | 'large' | 'compact';
}

export const AlbumArt: React.FC<AlbumArtProps> = ({
  song,
  isPlaying,
  ambientGlow,
  onToggleGlow,
  size = 'normal',
}) => {
  const [showVinyl, setShowVinyl] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);

  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Mount/unmount video player if user toggles Video mode
  useEffect(() => {
    if (isVideoMode && videoContainerRef.current && song.audioTrackId === 'youtube') {
      youtubeEngine.mountInto(videoContainerRef.current);
    } else {
      youtubeEngine.unmountToBackground();
    }

    return () => {
      youtubeEngine.unmountToBackground();
    };
  }, [isVideoMode, song.audioTrackId]);

  // Reset video mode if track changes
  useEffect(() => {
    setIsVideoMode(false);
  }, [song.id]);

  // Render bespoke high-contrast pure AMOLED geometric cover art
  const renderArtPattern = () => {
    if (song.thumbnailUrl) {
      return (
        <div className="relative w-full h-full bg-black overflow-hidden group/img">
          <img
            src={song.thumbnailUrl}
            alt={song.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
          />
          {/* Subtle AMOLED gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70" />
        </div>
      );
    }

    switch (song.coverStyle.type) {
      case 'eclipse':
        return (
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <rect width="400" height="400" fill="#000000" />
            <defs>
              <radialGradient id="eclipseGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="50%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="140" fill="url(#eclipseGlow)" />
            <circle cx="200" cy="200" r="110" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
            <circle cx="200" cy="200" r="90" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="200" cy="200" r="75" fill="#000000" stroke="url(#ringGrad)" strokeWidth="2.5" />
            <circle cx="195" cy="195" r="72" fill="#000000" />
            <line x1="40" y1="200" x2="360" y2="200" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" />
            <circle cx="200" cy="200" r="3" fill="#ffffff" />
          </svg>
        );

      case 'neon':
        return (
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <rect width="400" height="400" fill="#000000" />
            <defs>
              <linearGradient id="neonSlash" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="60%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
            {[60, 110, 160, 210, 260, 310, 350].map((x, i) => (
              <line
                key={i}
                x1={x}
                y1={30 + (i % 3) * 20}
                x2={x - 40}
                y2={370}
                stroke="#ffffff"
                strokeOpacity={0.06 + (i % 4) * 0.03}
                strokeWidth="1.5"
              />
            ))}
            <rect x="140" y="90" width="120" height="220" rx="4" fill="#050505" stroke="url(#neonSlash)" strokeWidth="2" />
            <circle cx="200" cy="160" r="28" stroke="#f43f5e" strokeWidth="1.5" />
            <circle cx="200" cy="230" r="14" fill="#fbbf24" fillOpacity="0.8" />
            <line x1="160" y1="280" x2="240" y2="280" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
          </svg>
        );

      case 'cosmic':
        return (
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <rect width="400" height="400" fill="#000000" />
            <defs>
              <radialGradient id="nebulaCore" cx="50%" cy="50%" r="45%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#a855f7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="150" fill="url(#nebulaCore)" />
            <path
              d="M 200,200 A 30,30 0 0,0 230,200 A 60,60 0 0,1 170,200 A 90,90 0 0,0 290,200 A 120,120 0 0,1 80,200"
              stroke="#38bdf8"
              strokeOpacity="0.4"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="120" cy="90" r="1.5" fill="#ffffff" />
            <circle cx="290" cy="110" r="2" fill="#ffffff" />
            <circle cx="310" cy="270" r="1.5" fill="#ffffff" fillOpacity="0.8" />
            <circle cx="90" cy="300" r="2" fill="#38bdf8" />
            <circle cx="200" cy="200" r="8" fill="#ffffff" />
          </svg>
        );

      case 'monolith':
        return (
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <rect width="400" height="400" fill="#000000" />
            <defs>
              <linearGradient id="emeraldGrad" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#047857" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
            <polygon points="200,60 320,150 320,290 200,340 80,290 80,150" fill="#050505" stroke="url(#emeraldGrad)" strokeWidth="2" />
            <line x1="200" y1="60" x2="200" y2="340" stroke="#10b981" strokeOpacity="0.4" strokeWidth="1" />
            <line x1="80" y1="150" x2="320" y2="290" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />
            <circle cx="200" cy="200" r="32" fill="#000000" stroke="#10b981" strokeWidth="1.5" />
          </svg>
        );

      case 'geometric':
      default:
        return (
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <rect width="400" height="400" fill="#000000" />
            <defs>
              <linearGradient id="solarFlare" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="70%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
            <rect x="100" y="100" width="200" height="200" rx="16" transform="rotate(45 200 200)" stroke="url(#solarFlare)" strokeWidth="2.5" fill="#080808" />
            <circle cx="200" cy="200" r="45" fill="#000000" stroke="#e11d48" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="6" fill="#f97316" />
          </svg>
        );
    }
  };

  const dimensionClass =
    size === 'large'
      ? 'w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96'
      : size === 'compact'
      ? 'w-48 h-48 sm:w-56 sm:h-56'
      : 'w-64 h-64 sm:w-76 sm:h-76 md:w-84 md:h-84 lg:w-92 lg:h-92';

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Subtle AMOLED Ambient Glow Reflection */}
      {ambientGlow && (
        <div
          className="absolute -inset-6 sm:-inset-10 rounded-full blur-3xl opacity-35 transition-all duration-1000 pointer-events-none"
          style={{
            backgroundColor: song.accentColor,
          }}
        />
      )}

      {/* Album Artwork Container with Vinyl Disc Extension */}
      <div className="relative group">
        {/* Animated Vinyl Disc */}
        {!isVideoMode && (
          <div
            className={`absolute top-2 -right-8 sm:-right-14 w-full h-full rounded-full bg-[#0a0a0a] border border-neutral-800 shadow-2xl transition-all duration-700 ease-out z-0 flex items-center justify-center pointer-events-none ${
              showVinyl
                ? 'translate-x-14 sm:translate-x-20 opacity-100'
                : 'translate-x-0 opacity-0 group-hover:translate-x-8 group-hover:opacity-40'
            }`}
          >
            <div
              className={`w-[94%] h-[94%] rounded-full border border-neutral-800 flex items-center justify-center ${
                isPlaying ? 'animate-spin-slow' : 'paused'
              }`}
            >
              <div className="w-[82%] h-[82%] rounded-full border border-neutral-800/80 flex items-center justify-center">
                <div className="w-[66%] h-[66%] rounded-full border border-neutral-800/60 flex items-center justify-center">
                  <div className="w-[50%] h-[50%] rounded-full border border-neutral-800/50 flex items-center justify-center">
                    <div
                      className="w-[34%] h-[34%] rounded-full flex items-center justify-center text-[9px] font-mono text-white/70"
                      style={{ backgroundColor: song.accentColor }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-black border border-white/40" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Cover Art Tile / Video Mount Frame */}
        <div
          onClick={() => !isVideoMode && setIsFlipped(!isFlipped)}
          className={`relative z-10 ${dimensionClass} rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-transform duration-300 ${
            !isVideoMode ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''
          }`}
        >
          {isVideoMode ? (
            /* YouTube Video Mounted Element */
            <div ref={videoContainerRef} className="w-full h-full bg-black flex items-center justify-center" />
          ) : !isFlipped ? (
            <>
              {renderArtPattern()}

              {/* Minimalist Top Hairline Details */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/70 tracking-wider">
                <span className="uppercase">{song.audioTrackId === 'youtube' ? 'YT MUSIC' : song.year}</span>
                <span className="tabular-nums opacity-60">
                  {song.audioTrackId === 'youtube' ? 'STREAM' : 'LP 01'}
                </span>
              </div>

              {/* Audio Format Subtle Footnote */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-white/60">
                <span className="truncate max-w-[170px] tracking-tight">{song.quality}</span>
                <span className="hover:text-white transition-colors flex items-center gap-1 opacity-80">
                  <Maximize2 className="w-3 h-3" />
                </span>
              </div>
            </>
          ) : (
            // Flip Backside Credits
            <div className="w-full h-full bg-[#050505] p-6 flex flex-col justify-between text-left border border-white/10 font-mono text-xs text-neutral-400">
              <div>
                <p className="text-[10px] uppercase text-neutral-500 tracking-widest mb-1">
                  {song.audioTrackId === 'youtube' ? 'YouTube Stream Info' : 'Album Credits'}
                </p>
                <h3 className="text-white text-base font-semibold font-sans mb-1">{song.album}</h3>
                <p className="text-neutral-300 text-xs font-sans mb-4">{song.artist}</p>

                <div className="space-y-2 text-[11px] border-t border-neutral-900 pt-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Track:</span>
                    <span className="text-neutral-200 truncate max-w-[170px]">{song.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Source:</span>
                    <span className="text-neutral-200">{song.audioTrackId === 'youtube' ? 'YouTube Music API' : 'Synthesizer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Quality:</span>
                    <span className="text-neutral-200">{song.quality}</span>
                  </div>
                  {song.views && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Streams:</span>
                      <span className="text-neutral-200">{song.views}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-neutral-600 border-t border-neutral-900 pt-2 flex justify-between items-center">
                <span>Tap to flip back</span>
                <span className="text-white/60">nxmusic AMOLED</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Utility Toggles under the Album Art */}
      <div className="flex items-center gap-4 mt-4 text-xs text-neutral-500">
        {song.audioTrackId === 'youtube' && (
          <>
            <button
              onClick={() => setIsVideoMode(!isVideoMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                isVideoMode ? 'text-white bg-red-600/30 text-red-400 border border-red-500/30' : 'hover:text-neutral-300'
              }`}
              title="Toggle between Album Art and Official Video"
            >
              {isVideoMode ? <ImageIcon className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{isVideoMode ? 'Art' : 'Video'}</span>
            </button>
            <span className="text-neutral-800" aria-hidden="true">·</span>
          </>
        )}

        <button
          onClick={() => setShowVinyl(!showVinyl)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
            showVinyl ? 'text-white bg-white/10' : 'hover:text-neutral-300'
          }`}
          title="Toggle Vinyl Record Display"
        >
          <Disc3 className={`w-3.5 h-3.5 ${isPlaying && showVinyl ? 'animate-spin' : ''}`} />
          <span className="text-[11px]">Vinyl</span>
        </button>

        <span className="text-neutral-800" aria-hidden="true">·</span>

        <button
          onClick={onToggleGlow}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
            ambientGlow ? 'text-white bg-white/10' : 'hover:text-neutral-300'
          }`}
          title="Toggle AMOLED Ambient Room Glow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px]">Glow {ambientGlow ? 'On' : 'Off'}</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SONGS } from './data/songs.ts';
import { Song, AppTab, RepeatMode, ViewMode } from './types.ts';
import { audioEngine } from './utils/audioEngine.ts';
import { youtubeEngine } from './utils/youtubePlayer.ts';
import { TopBar } from './components/TopBar.tsx';
import { BottomNavBar } from './components/BottomNavBar.tsx';
import { MiniPlayer } from './components/MiniPlayer.tsx';
import { NowPlayingExpanded } from './components/NowPlayingExpanded.tsx';
import { QueueDrawer } from './components/QueueDrawer.tsx';
import { YouTubeMusicModal } from './components/YouTubeMusicModal.tsx';
import { HomeView } from './views/HomeView.tsx';
import { MixView } from './views/MixView.tsx';
import { LibraryView } from './views/LibraryView.tsx';
import { SearchView } from './views/SearchView.tsx';
import { TOP_ARTISTS } from './data/mockData.ts';

export default function App() {
  const [songsList, setSongsList] = useState<Song[]>(() => {
    // Combine curated tracks with top hits
    const initialList = [...SONGS];
    if (TOP_ARTISTS[0]?.popularTracks) {
      initialList.unshift(...TOP_ARTISTS[0].popularTracks);
    }
    return initialList;
  });

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(219);
  const [volume, setVolume] = useState(0.85);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [isShuffled, setIsShuffled] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isNowPlayingExpanded, setIsNowPlayingExpanded] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSong = songsList[currentSongIndex] || songsList[0];
  const isYouTubeTrack = currentSong?.audioTrackId === 'youtube';

  // Handle track ending
  const handleTrackEnded = useCallback(() => {
    if (repeatMode === 'one') {
      if (isYouTubeTrack) {
        youtubeEngine.seekTo(0);
        youtubeEngine.play();
      } else {
        audioEngine.seek(0);
        audioEngine.play();
      }
      setIsPlaying(true);
      return;
    }

    if (isShuffled) {
      const nextIdx = Math.floor(Math.random() * songsList.length);
      setCurrentSongIndex(nextIdx);
    } else {
      if (currentSongIndex < songsList.length - 1) {
        setCurrentSongIndex(currentSongIndex + 1);
      } else if (repeatMode === 'all') {
        setCurrentSongIndex(0);
      } else {
        setIsPlaying(false);
      }
    }
  }, [repeatMode, isShuffled, currentSongIndex, songsList.length, isYouTubeTrack]);

  // Load track into engine
  useEffect(() => {
    setCurrentTime(0);
    setDuration(currentSong.duration || 180);

    if (isYouTubeTrack && currentSong.youtubeVideoId) {
      audioEngine.pause();
      youtubeEngine.loadVideo(currentSong.youtubeVideoId, isPlaying);
    } else {
      youtubeEngine.pause();
      audioEngine.loadTrack(
        currentSong.audioTrackId as any,
        currentSong.duration,
        currentSong.customAudioUrl
      );
      if (isPlaying) {
        audioEngine.play();
      }
    }
  }, [currentSongIndex, songsList]);

  // Engine callbacks
  useEffect(() => {
    audioEngine.setTimeUpdateListener((time) => {
      if (!isYouTubeTrack) {
        setCurrentTime(time);
      }
    });
    audioEngine.setEndedListener(handleTrackEnded);

    youtubeEngine.setTimeUpdateListener((time) => {
      if (isYouTubeTrack) {
        setCurrentTime(time);
        const ytDur = youtubeEngine.getDuration();
        if (ytDur > 0 && ytDur !== duration) {
          setDuration(ytDur);
        }
      }
    });

    youtubeEngine.setStateChangeListener((playing) => {
      if (isYouTubeTrack) {
        setIsPlaying(playing);
      }
    });

    youtubeEngine.setEndedListener(handleTrackEnded);

    return () => {
      audioEngine.setTimeUpdateListener(() => {});
      audioEngine.setEndedListener(() => {});
      youtubeEngine.setTimeUpdateListener(() => {});
      youtubeEngine.setStateChangeListener(() => {});
      youtubeEngine.setEndedListener(() => {});
    };
  }, [handleTrackEnded, isYouTubeTrack, duration]);

  // Controls
  const handlePlayPause = () => {
    if (isPlaying) {
      if (isYouTubeTrack) {
        youtubeEngine.pause();
      } else {
        audioEngine.pause();
      }
      setIsPlaying(false);
    } else {
      if (isYouTubeTrack) {
        youtubeEngine.play();
      } else {
        audioEngine.play();
      }
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (isShuffled) {
      const randomIdx = Math.floor(Math.random() * songsList.length);
      setCurrentSongIndex(randomIdx);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % songsList.length);
    }
  };

  const handlePrevious = () => {
    if (currentTime > 3) {
      if (isYouTubeTrack) {
        youtubeEngine.seekTo(0);
      } else {
        audioEngine.seek(0);
      }
      setCurrentTime(0);
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + songsList.length) % songsList.length);
    }
  };

  const handleSeek = (seconds: number) => {
    if (isYouTubeTrack) {
      youtubeEngine.seekTo(seconds);
    } else {
      audioEngine.seek(seconds);
    }
    setCurrentTime(seconds);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    audioEngine.setVolume(vol);
    youtubeEngine.setVolume(vol);
  };

  const handlePlaySpecificSong = (song: Song) => {
    const existingIdx = songsList.findIndex((s) => s.id === song.id);
    if (existingIdx !== -1) {
      setCurrentSongIndex(existingIdx);
      setIsPlaying(true);
    } else {
      setSongsList([song, ...songsList]);
      setCurrentSongIndex(0);
      setIsPlaying(true);
    }
  };

  const handleAddToQueue = (song: Song) => {
    const existingIdx = songsList.findIndex((s) => s.id === song.id);
    if (existingIdx === -1) {
      setSongsList([...songsList, song]);
    }
  };

  const handleOpenSearchWithCategory = (category: string) => {
    setSearchInitialQuery(category);
    setActiveTab('search');
  };

  const handleSelectArtist = (artistId: string) => {
    setSelectedArtistId(artistId);
    setActiveTab('library');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSeek(Math.min(duration, currentTime + 5));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSeek(Math.max(0, currentTime - 5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, duration]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const objectUrl = URL.createObjectURL(file);
            const customSong: Song = {
              id: `custom-${Date.now()}`,
              title: file.name.replace(/\.[^/.]+$/, ''),
              artist: 'Local Audio',
              album: 'User Upload',
              year: '2026',
              genre: 'Audio',
              duration: 210,
              quality: 'Lossless Hi-Res',
              accentColor: '#3b82f6',
              secondaryColor: '#1d4ed8',
              coverStyle: {
                type: 'cosmic',
                baseGradient: 'from-blue-950 to-black',
                accentGlow: 'rgba(59, 130, 246, 0.4)',
              },
              audioTrackId: 'custom',
              customAudioUrl: objectUrl,
              lyrics: currentSong.lyrics,
            };
            handlePlaySpecificSong(customSong);
          }
        }}
        accept="audio/*"
        className="hidden"
      />

      {/* 1. Header Bar (Top Bar Contract: nxmusic) */}
      <TopBar
        viewMode="player"
        onChangeViewMode={() => setIsNowPlayingExpanded(true)}
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenYouTubeModal={() => setIsYouTubeModalOpen(true)}
        onToggleUpload={() => fileInputRef.current?.click()}
      />

      {/* 2. Main Tab View Router */}
      <main className="flex-1 w-full relative z-10">
        {activeTab === 'home' && (
          <HomeView
            onPlaySong={handlePlaySpecificSong}
            onAddToQueue={handleAddToQueue}
            songs={songsList}
            currentSongId={currentSong.id}
            onOpenSearch={() => setActiveTab('search')}
            onSelectArtist={handleSelectArtist}
          />
        )}

        {activeTab === 'mix' && (
          <MixView
            onPlaySong={handlePlaySpecificSong}
            onOpenSearchWithCategory={handleOpenSearchWithCategory}
            songs={songsList}
          />
        )}

        {activeTab === 'library' && (
          <LibraryView
            onPlaySong={handlePlaySpecificSong}
            songs={songsList}
            selectedArtistId={selectedArtistId}
            onClearArtist={() => setSelectedArtistId(null)}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            onPlaySong={handlePlaySpecificSong}
            onAddToQueue={handleAddToQueue}
            initialQuery={searchInitialQuery}
          />
        )}
      </main>

      {/* 3. Floating Mini Player (Pinned above bottom nav bar) */}
      <MiniPlayer
        song={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onExpand={() => setIsNowPlayingExpanded(true)}
      />

      {/* 4. Bottom 4-Tab Navigation Bar */}
      <BottomNavBar activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* 5. Expanded Fullscreen Now Playing View (Liquid Glass / Material 3 / AMOLED + Synced Lyrics) */}
      <NowPlayingExpanded
        isOpen={isNowPlayingExpanded}
        onClose={() => setIsNowPlayingExpanded(false)}
        song={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        repeatMode={repeatMode}
        isShuffled={isShuffled}
        onPlayPause={handlePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleShuffle={() => setIsShuffled(!isShuffled)}
        onCycleRepeat={() =>
          setRepeatMode((prev) =>
            prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'
          )
        }
      />

      {/* 6. Queue Drawer */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        songs={songsList}
        currentSongIndex={currentSongIndex}
        isPlaying={isPlaying}
        onSelectSong={(idx) => {
          setCurrentSongIndex(idx);
          if (!isPlaying) handlePlayPause();
        }}
        onUploadCustomTrack={(file) => {
          const objectUrl = URL.createObjectURL(file);
          const customSong: Song = {
            id: `custom-${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Local Audio',
            album: 'User Upload',
            year: '2026',
            genre: 'Audio',
            duration: 210,
            quality: 'Lossless Hi-Res',
            accentColor: '#3b82f6',
            secondaryColor: '#1d4ed8',
            coverStyle: {
              type: 'cosmic',
              baseGradient: 'from-blue-950 to-black',
              accentGlow: 'rgba(59, 130, 246, 0.4)',
            },
            audioTrackId: 'custom',
            customAudioUrl: objectUrl,
            lyrics: currentSong.lyrics,
          };
          handlePlaySpecificSong(customSong);
          setIsQueueOpen(false);
        }}
      />

      {/* 7. YouTube Music Search Modal */}
      <YouTubeMusicModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        onSelectTrack={(track, playNow) => {
          if (playNow) {
            handlePlaySpecificSong(track);
          } else {
            handleAddToQueue(track);
          }
        }}
      />
    </div>
  );
}

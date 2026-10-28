// Unified client-side YouTube IFrame Player engine for YouTube Music playback

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

class YouTubePlayerEngine {
  private player: any = null;
  private isApiLoaded = false;
  private isReady = false;
  private currentVideoId: string | null = null;
  private isCurrentlyPlaying = false;
  private duration = 0;
  private volume = 85; // 0 to 100
  private playbackRate = 1.0;

  private timeUpdateCallback: ((time: number) => void) | null = null;
  private stateChangeCallback: ((isPlaying: boolean) => void) | null = null;
  private endedCallback: (() => void) | null = null;
  private animFrameId: number | null = null;

  private pendingVideoId: string | null = null;
  private containerId = 'yt-hidden-player';

  constructor() {
    this.initApi();
  }

  private initApi() {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      this.isApiLoaded = true;
      this.initPlayer();
      return;
    }

    // Load YouTube IFrame API script
    const prevScript = document.getElementById('youtube-iframe-api');
    if (!prevScript) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const prevOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevOnReady) prevOnReady();
      this.isApiLoaded = true;
      this.initPlayer();
    };
  }

  private initPlayer() {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      // Position offscreen by default, with minimum 200px size so YouTube doesn't throttle playback
      container.style.position = 'fixed';
      container.style.bottom = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '320px';
      container.style.height = '180px';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-1';
      document.body.appendChild(container);
    }

    try {
      this.player = new window.YT.Player(this.containerId, {
        height: '100%',
        width: '100%',
        videoId: this.pendingVideoId || 'Rif-RTvmmss', // Default initial track
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            this.isReady = true;
            this.player.setVolume(this.volume);
            if (this.pendingVideoId) {
              this.loadVideo(this.pendingVideoId, true);
              this.pendingVideoId = null;
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0, BUFFERING = 3
            if (event.data === 1) {
              this.isCurrentlyPlaying = true;
              this.duration = this.player.getDuration() || 0;
              this.startPolling();
              if (this.stateChangeCallback) this.stateChangeCallback(true);
            } else if (event.data === 2) {
              this.isCurrentlyPlaying = false;
              this.stopPolling();
              if (this.stateChangeCallback) this.stateChangeCallback(false);
            } else if (event.data === 0) {
              this.isCurrentlyPlaying = false;
              this.stopPolling();
              if (this.endedCallback) this.endedCallback();
            }
          },
        },
      });
    } catch (e) {
      console.error('Failed to create YouTube Player:', e);
    }
  }

  public setTimeUpdateListener(cb: (time: number) => void) {
    this.timeUpdateCallback = cb;
  }

  public setStateChangeListener(cb: (isPlaying: boolean) => void) {
    this.stateChangeCallback = cb;
  }

  public setEndedListener(cb: () => void) {
    this.endedCallback = cb;
  }

  public loadVideo(videoId: string, autoplay = true) {
    this.currentVideoId = videoId;

    if (!this.isReady || !this.player || !this.player.loadVideoById) {
      this.pendingVideoId = videoId;
      return;
    }

    try {
      if (autoplay) {
        this.player.loadVideoById({
          videoId,
          startSeconds: 0,
        });
        this.isCurrentlyPlaying = true;
      } else {
        this.player.cueVideoById({
          videoId,
          startSeconds: 0,
        });
        this.isCurrentlyPlaying = false;
      }
    } catch (err) {
      console.error('Error loading video by ID:', err);
    }
  }

  public play() {
    if (!this.player || !this.player.playVideo) return;
    try {
      this.player.playVideo();
      this.isCurrentlyPlaying = true;
      this.startPolling();
    } catch (err) {
      console.error('Error playing YouTube video:', err);
    }
  }

  public pause() {
    if (!this.player || !this.player.pauseVideo) return;
    try {
      this.player.pauseVideo();
      this.isCurrentlyPlaying = false;
      this.stopPolling();
    } catch (err) {
      console.error('Error pausing YouTube video:', err);
    }
  }

  public seekTo(seconds: number) {
    if (!this.player || !this.player.seekTo) return;
    try {
      this.player.seekTo(seconds, true);
      if (this.timeUpdateCallback) {
        this.timeUpdateCallback(seconds);
      }
    } catch (err) {
      console.error('Error seeking in YouTube video:', err);
    }
  }

  public setVolume(vol: number) {
    // vol: 0.0 to 1.0
    this.volume = Math.round(Math.max(0, Math.min(1, vol)) * 100);
    if (this.player && this.player.setVolume) {
      this.player.setVolume(this.volume);
    }
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.player && this.player.setPlaybackRate) {
      this.player.setPlaybackRate(rate);
    }
  }

  public getCurrentTime(): number {
    if (!this.player || !this.player.getCurrentTime) return 0;
    try {
      return this.player.getCurrentTime() || 0;
    } catch {
      return 0;
    }
  }

  public getDuration(): number {
    if (!this.player || !this.player.getDuration) return this.duration;
    try {
      return this.player.getDuration() || this.duration;
    } catch {
      return this.duration;
    }
  }

  public isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }

  private startPolling() {
    this.stopPolling();
    const update = () => {
      if (!this.isCurrentlyPlaying) return;
      const current = this.getCurrentTime();
      if (this.timeUpdateCallback) {
        this.timeUpdateCallback(current);
      }
      this.animFrameId = requestAnimationFrame(update);
    };
    this.animFrameId = requestAnimationFrame(update);
  }

  private stopPolling() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  // Mount the YouTube iframe into a target DOM element (e.g. for Video Mode)
  public mountInto(element: HTMLElement) {
    const iframe = document.getElementById(this.containerId);
    if (iframe && element) {
      iframe.style.position = 'relative';
      iframe.style.bottom = 'auto';
      iframe.style.left = 'auto';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.opacity = '1';
      iframe.style.pointerEvents = 'auto';
      iframe.style.zIndex = '10';
      element.appendChild(iframe);
    }
  }

  // Detach back to offscreen container
  public unmountToBackground() {
    const iframe = document.getElementById(this.containerId);
    if (iframe) {
      iframe.style.position = 'fixed';
      iframe.style.bottom = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '320px';
      iframe.style.height = '180px';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      iframe.style.zIndex = '-1';
      document.body.appendChild(iframe);
    }
  }
}

export const youtubeEngine = new YouTubePlayerEngine();

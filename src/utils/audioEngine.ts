// Robust Web Audio engine with synthesized real audio compositions & custom audio playback

type AudioTrackId = 'midnight' | 'neon' | 'starlight' | 'velvet' | 'solar' | 'custom';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  
  // Custom audio element support
  private audioElement: HTMLAudioElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;
  private isUsingCustomAudio = false;

  // Synthesizer state
  private isPlaying = false;
  private currentTrackId: AudioTrackId = 'midnight';
  private trackStartTime = 0;
  private pausedAtTime = 0;
  private duration = 184;
  private playbackRate = 1.0;
  private volume = 0.85;

  private schedulerTimer: number | null = null;
  private animFrameId: number | null = null;
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;

  // Synthesis clock
  private nextBeatTime = 0;
  private currentBeat = 0;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setTimeUpdateListener(cb: (time: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public setEndedListener(cb: () => void) {
    this.onEndedCallback = cb;
  }

  public loadTrack(trackId: AudioTrackId, duration: number, customUrl?: string) {
    this.pause();
    this.currentTrackId = trackId;
    this.duration = duration;
    this.pausedAtTime = 0;

    if (customUrl) {
      this.isUsingCustomAudio = true;
      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.crossOrigin = 'anonymous';
      }
      this.audioElement.src = customUrl;
      this.audioElement.playbackRate = this.playbackRate;
      this.audioElement.volume = this.volume;
      this.audioElement.onended = () => {
        if (this.onEndedCallback) this.onEndedCallback();
      };
    } else {
      this.isUsingCustomAudio = false;
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.src = '';
      }
    }
  }

  public play() {
    this.initContext();
    if (!this.ctx) return;

    if (this.isUsingCustomAudio && this.audioElement) {
      this.audioElement.play().catch(() => {
        // Fallback to synth if custom audio fails
        this.isUsingCustomAudio = false;
        this.playSynthesizer();
      });
      this.startLoop();
      this.isPlaying = true;
      return;
    }

    this.playSynthesizer();
  }

  private playSynthesizer() {
    if (!this.ctx) return;
    this.isPlaying = true;
    this.trackStartTime = this.ctx.currentTime - this.pausedAtTime;
    this.nextBeatTime = this.ctx.currentTime;
    this.currentBeat = Math.floor(this.pausedAtTime * 2); // 120 BPM approx

    this.scheduleNotes();
    this.startLoop();
  }

  public pause() {
    this.isPlaying = false;
    if (this.schedulerTimer) {
      window.clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.isUsingCustomAudio && this.audioElement) {
      this.audioElement.pause();
      this.pausedAtTime = this.audioElement.currentTime;
    } else if (this.ctx) {
      this.pausedAtTime = Math.max(0, this.ctx.currentTime - this.trackStartTime);
    }
  }

  public seek(seconds: number) {
    const clamped = Math.max(0, Math.min(seconds, this.duration));
    this.pausedAtTime = clamped;

    if (this.isUsingCustomAudio && this.audioElement) {
      this.audioElement.currentTime = clamped;
    }

    if (this.ctx) {
      this.trackStartTime = this.ctx.currentTime - clamped;
      this.nextBeatTime = this.ctx.currentTime;
      this.currentBeat = Math.floor(clamped * 2);
    }

    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(clamped);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }

  public getCurrentTime(): number {
    if (this.isUsingCustomAudio && this.audioElement) {
      return this.audioElement.currentTime;
    }
    if (!this.ctx || !this.isPlaying) {
      return this.pausedAtTime;
    }
    return Math.max(0, Math.min(this.duration, (this.ctx.currentTime - this.trackStartTime) * this.playbackRate));
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  private startLoop() {
    const update = () => {
      if (!this.isPlaying) return;
      const current = this.getCurrentTime();

      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(current);
      }

      if (current >= this.duration) {
        this.pause();
        this.seek(0);
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
        return;
      }

      this.animFrameId = requestAnimationFrame(update);
    };
    this.animFrameId = requestAnimationFrame(update);
  }

  // Real-time audio synthesizer for ambient, synthwave, lo-fi & electronic grooves
  private scheduleNotes() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const lookahead = 0.1; // 100ms
    const scheduleUntil = this.ctx.currentTime + lookahead;

    while (this.nextBeatTime < scheduleUntil) {
      this.triggerBeat(this.nextBeatTime, this.currentBeat);
      
      // Calculate beat step based on track genre (BPM)
      let bpm = 120;
      if (this.currentTrackId === 'midnight') bpm = 118;
      else if (this.currentTrackId === 'neon') bpm = 88;
      else if (this.currentTrackId === 'starlight') bpm = 74;
      else if (this.currentTrackId === 'velvet') bpm = 78;
      else if (this.currentTrackId === 'solar') bpm = 124;

      const beatDuration = (60 / bpm) / 2; // Eighth note steps
      this.nextBeatTime += beatDuration / this.playbackRate;
      this.currentBeat++;
    }

    this.schedulerTimer = window.setTimeout(() => this.scheduleNotes(), 40);
  }

  private triggerBeat(time: number, beat: number) {
    if (!this.ctx || !this.masterGain) return;

    // Pitch scales
    // Midnight: D minor (D, F, G, A, C)
    const midnightBassNotes = [73.42, 73.42, 65.41, 65.41, 58.27, 58.27, 65.41, 65.41]; // D2, C2, Bb1, C2
    const midnightLeadNotes = [293.66, 349.23, 392.00, 440.00, 523.25, 440.00, 349.23, 293.66]; // D4, F4, G4, A4, C5

    // Neon: G minor (G, Bb, C, D, F)
    const neonBassNotes = [98.00, 98.00, 87.31, 87.31, 116.54, 116.54, 103.83, 103.83];
    const neonKeysNotes = [196.00, 233.08, 293.66, 349.23];

    // Starlight: F major ambient (F, A, C, E)
    const starlightNotes = [174.61, 220.00, 261.63, 329.63, 349.23];

    // Velvet: Eb major 7 / C minor 9
    const velvetChords = [155.56, 196.00, 233.08, 293.66];

    // Solar: A minor / F major
    const solarBass = [110.00, 110.00, 87.31, 87.31, 130.81, 130.81, 98.00, 98.00];

    const step = beat % 16;

    if (this.currentTrackId === 'midnight') {
      // 1. Kick on 0, 4, 8, 12
      if (step % 4 === 0) {
        this.playKick(time);
      }
      // 2. Snare / Clap on 4, 12
      if (step === 4 || step === 12) {
        this.playSnare(time);
      }
      // 3. Rolling synthwave bass on every 8th note
      const bassFreq = midnightBassNotes[Math.floor(beat / 4) % midnightBassNotes.length];
      this.playSynthBass(time, bassFreq, 0.18, 'sawtooth');

      // 4. Arpeggiator every 2 beats
      if (step % 2 === 0) {
        const leadFreq = midnightLeadNotes[beat % midnightLeadNotes.length];
        this.playLeadArp(time, leadFreq, 0.15);
      }
    } else if (this.currentTrackId === 'neon') {
      // Chill cyberpunk beat
      if (step === 0 || step === 6 || step === 10) {
        this.playKick(time, 0.7);
      }
      if (step === 4 || step === 12) {
        this.playSnare(time, 0.6);
      }
      if (step % 2 === 1) {
        this.playHiHat(time, 0.2);
      }
      if (step % 4 === 0) {
        const chordNote = neonKeysNotes[(Math.floor(beat / 8)) % neonKeysNotes.length];
        this.playElectricKeys(time, chordNote, 0.8);
      }
      const bassFreq = neonBassNotes[Math.floor(beat / 4) % neonBassNotes.length];
      this.playSynthBass(time, bassFreq, 0.3, 'sine');
    } else if (this.currentTrackId === 'starlight') {
      // Ambient celestial wash
      if (step % 8 === 0) {
        const note = starlightNotes[Math.floor(beat / 8) % starlightNotes.length];
        this.playCelestialPad(time, note, 2.8);
      }
      if (step % 4 === 0) {
        this.playShimmerBell(time, starlightNotes[(beat * 3) % starlightNotes.length] * 2, 0.6);
      }
    } else if (this.currentTrackId === 'velvet') {
      // Neo soul groove
      if (step === 0 || step === 7) {
        this.playKick(time, 0.6);
      }
      if (step === 4 || step === 12) {
        this.playRimshot(time);
      }
      if (step % 2 === 0) {
        this.playHiHat(time, 0.18);
      }
      if (step % 8 === 0) {
        const chord = velvetChords[Math.floor(beat / 8) % velvetChords.length];
        this.playElectricKeys(time, chord, 1.2);
      }
    } else {
      // Solar: Melodic Electronic
      if (step % 4 === 0) {
        this.playKick(time, 0.9);
      }
      if (step === 4 || step === 12) {
        this.playSnare(time, 0.8);
      }
      if (step % 2 === 1) {
        this.playHiHat(time, 0.25);
      }
      const bFreq = solarBass[Math.floor(beat / 2) % solarBass.length];
      this.playSynthBass(time, bFreq, 0.14, 'triangle');
    }
  }

  // Instrument sound synthesizers
  private playKick(time: number, power = 1.0) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.12);

    gain.gain.setValueAtTime(0.7 * power, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.22);
  }

  private playSnare(time: number, power = 0.8) {
    if (!this.ctx || !this.masterGain) return;
    // Tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(60, time + 0.1);
    oscGain.gain.setValueAtTime(0.3 * power, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.15);

    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4 * power, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.18);
  }

  private playHiHat(time: number, vol = 0.2) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(8000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  private playRimshot(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, time);
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.04);
  }

  private playSynthBass(time: number, freq: number, dur: number, wave: OscillatorType = 'sawtooth') {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = wave;
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(150, time + dur);
    filter.Q.setValueAtTime(3, time);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + dur);
  }

  private playLeadArp(time: number, freq: number, dur: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, time);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + dur);
  }

  private playElectricKeys(time: number, freq: number, dur: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + dur);
  }

  private playCelestialPad(time: number, freq: number, dur: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.5, time); // Fifth

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur);
    osc2.stop(time + dur);
  }

  private playShimmerBell(time: number, freq: number, dur: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + dur);
  }

  public destroy() {
    this.pause();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
  }
}

export const audioEngine = new AudioEngine();

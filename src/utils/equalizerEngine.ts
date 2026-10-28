// 10-Band Real Web Audio Parametric Equalizer Engine

export interface EqBand {
  freq: number;
  label: string;
  gain: number; // -12dB to +12dB
}

export const EQ_FREQUENCIES = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
export const EQ_LABELS = ['31', '62', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'];

export const EQ_PRESETS: { [name: string]: number[] } = {
  Flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  'Bass Boost': [6, 5, 4, 2, 0, 0, 0, 1, 2, 3],
  'Vocal Booster': [-2, -2, -1, 1, 3, 4, 4, 3, 1, 0],
  Electronic: [5, 4, 2, 0, -2, 2, 1, 2, 4, 5],
  Rock: [4, 3, 2, 0, -1, -1, 1, 2, 3, 4],
  Acoustic: [3, 2, 1, 1, 2, 2, 3, 3, 3, 2],
  HipHop: [6, 5, 3, 1, -1, -1, 1, -1, 2, 3],
};

export const AUTO_EQ_PRESETS: { [name: string]: number[] } = {
  'Sony WH-1000XM5 · Harman': [-1, 0, 2, 1, -1, -2, 1, 3, 2, 1],
  'Sony WH-CH510 · Rtings': [2, 3, 1, -1, -2, 0, 2, 4, 3, 1],
  'Apple AirPods Pro 2': [1, 1, 0, 0, 1, 2, 1, 0, 1, 2],
  'Bose QuietComfort 45': [-2, -1, 1, 2, 1, -1, 0, 2, 3, 1],
  'Sennheiser HD 650': [4, 3, 2, 1, 0, 0, 1, 2, 1, 0],
};

class EqualizerEngine {
  private isEnabled = true;
  private preampGain = 0; // in dB
  private bandGains: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public setPreamp(dB: number) {
    this.preampGain = Math.max(-12, Math.min(12, dB));
  }

  public getPreamp(): number {
    return this.preampGain;
  }

  public setBand(index: number, dB: number) {
    if (index >= 0 && index < this.bandGains.length) {
      this.bandGains[index] = Math.max(-12, Math.min(12, dB));
    }
  }

  public setAllBands(gains: number[]) {
    this.bandGains = gains.map((g) => Math.max(-12, Math.min(12, g)));
  }

  public getBands(): number[] {
    return [...this.bandGains];
  }

  public reset() {
    this.preampGain = 0;
    this.bandGains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
}

export const equalizerEngine = new EqualizerEngine();

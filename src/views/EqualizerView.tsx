import React, { useState } from 'react';
import {
  equalizerEngine,
  EQ_FREQUENCIES,
  EQ_LABELS,
  EQ_PRESETS,
  AUTO_EQ_PRESETS,
} from '../utils/equalizerEngine.ts';
import { RotateCcw, Check, Headphones, Sliders, ChevronDown } from 'lucide-react';

export const EqualizerView: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<string>('Custom');
  const [selectedAutoEq, setSelectedAutoEq] = useState<string>('Sony WH-CH510 · Rtings');
  const [preamp, setPreamp] = useState(-5);
  const [bands, setBands] = useState<number[]>([2, 3, 1, -1, -2, 0, 2, 4, 3, 1]);
  const [savePlaybackState, setSavePlaybackState] = useState(true);

  // Apply preset
  const handleSelectPreset = (name: string) => {
    setSelectedPreset(name);
    if (EQ_PRESETS[name]) {
      setBands(EQ_PRESETS[name]);
      equalizerEngine.setAllBands(EQ_PRESETS[name]);
    }
  };

  // Apply AutoEq headphone profile
  const handleSelectAutoEq = (name: string) => {
    setSelectedAutoEq(name);
    if (AUTO_EQ_PRESETS[name]) {
      setBands(AUTO_EQ_PRESETS[name]);
      equalizerEngine.setAllBands(AUTO_EQ_PRESETS[name]);
      setSelectedPreset('Custom');
    }
  };

  // Update single band
  const handleBandChange = (index: number, val: number) => {
    const updated = [...bands];
    updated[index] = val;
    setBands(updated);
    setSelectedPreset('Custom');
    equalizerEngine.setBand(index, val);
  };

  // Reset
  const handleReset = () => {
    setPreamp(0);
    setBands([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    setSelectedPreset('Flat');
    equalizerEngine.reset();
  };

  // SVG Curve generation for the 10-band equalizer
  const renderEqCurve = () => {
    const width = 360;
    const height = 140;
    const points = bands.map((gain, i) => {
      const x = (i / (bands.length - 1)) * (width - 40) + 20;
      // map gain (-12 to +12) to y (height to 0)
      const y = height / 2 - (gain / 12) * (height / 2 - 16);
      return { x, y };
    });

    let pathD = `M ${points[0].x} ${points[0].y} `;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      pathD += `C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y} `;
    }

    return (
      <svg className="w-full h-36 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        {/* Subtle grid lines */}
        <line x1="10" y1={height / 2} x2={width - 10} y2={height / 2} stroke="#333333" strokeDasharray="2 3" strokeWidth="1" />
        <line x1="10" y1="16" x2={width - 10} y2="16" stroke="#222222" strokeWidth="1" />
        <line x1="10" y1={height - 16} x2={width - 10} y2={height - 16} stroke="#222222" strokeWidth="1" />

        {/* Shaded Area under Curve */}
        <path
          d={`${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`}
          fill="url(#eqGlowGradient)"
          opacity="0.25"
        />

        <defs>
          <linearGradient id="eqGlowGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Curve Line */}
        <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

        {/* Interactive draggable nodes */}
        {points.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r="4.5"
            fill="#ffffff"
            stroke="#38bdf8"
            strokeWidth="2"
            className="cursor-pointer"
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 space-y-6 select-none pb-28">
      {/* Header (Screenshot 1) */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Equalizer</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Shape the sound with a ten-band curve
          </p>
        </div>

        {/* Master Toggle */}
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`w-12 h-7 rounded-full p-1 transition-colors ${
            isEnabled ? 'bg-sky-500' : 'bg-neutral-800'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Main EQ Card Container (Screenshot 1) */}
      <div className="bg-neutral-950/80 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-6 backdrop-blur-xl shadow-2xl">
        {/* Presets and AutoEq Dropdowns */}
        <div className="space-y-4">
          {/* Preset Selector */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-400">Presets</label>
            <div className="relative">
              <select
                value={selectedPreset}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="bg-neutral-900 border border-white/10 text-white text-xs rounded-xl px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="Custom">Custom</option>
                {Object.keys(EQ_PRESETS).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* AutoEq Headphone Profile Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400">
              <Headphones className="w-3.5 h-3.5 text-sky-400" />
              <span>AutoEq</span>
            </div>
            <div className="relative">
              <select
                value={selectedAutoEq}
                onChange={(e) => handleSelectAutoEq(e.target.value)}
                className="bg-neutral-900 border border-white/10 text-white text-xs rounded-xl px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:border-sky-500 cursor-pointer max-w-[200px] truncate"
              >
                {Object.keys(AUTO_EQ_PRESETS).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Preamp Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Preamp</span>
              <span className="font-mono text-sky-400 font-semibold tabular-nums">
                {preamp > 0 ? `+${preamp}` : preamp} dB
              </span>
            </div>
            <input
              type="range"
              min={-12}
              max={12}
              value={preamp}
              onChange={(e) => setPreamp(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>
        </div>

        {/* 10-Band Curve Display */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-[10px] font-mono text-neutral-500">
            <span>+12dB</span>
            <span>-12dB</span>
          </div>

          <div className="bg-black/60 rounded-2xl p-2 border border-white/5">
            {renderEqCurve()}
          </div>

          {/* 10 Individual Vertical Sliders */}
          <div className="grid grid-cols-10 gap-1 sm:gap-2 pt-2">
            {bands.map((gain, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <input
                  type="range"
                  min={-12}
                  max={12}
                  value={gain}
                  onChange={(e) => handleBandChange(i, parseInt(e.target.value, 10))}
                  className="h-20 w-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-sky-400 [writing-mode:vertical-lr] [direction:rtl]"
                />
                <span className="text-[9px] font-mono text-neutral-400">
                  {EQ_LABELS[i]}
                </span>
              </div>
            ))}
          </div>

          {/* Reset Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Playback State Option (Screenshot 1) */}
      <div className="bg-neutral-950/80 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white">Save Playback State</h4>
          <p className="text-xs text-neutral-500">Save shuffle and repeat mode</p>
        </div>
        <button
          onClick={() => setSavePlaybackState(!savePlaybackState)}
          className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
            savePlaybackState ? 'bg-sky-500' : 'bg-neutral-800'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              savePlaybackState ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

import React from 'react';

const inputClass =
  'w-full px-3 py-2 rounded-full border border-border bg-white/50 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';
const labelClass = 'block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide';

export default function ChessboardConfig({ config, onChange }) {
  const set = (key, value) => onChange({ ...config, [key]: value });

  return (
    <div className="space-y-4">
      {/* Squares X */}
      <div>
        <label className={labelClass}>Columns ({config.squaresX})</label>
        <input
          type="range"
          min={4}
          max={14}
          className="w-full mt-1"
          value={config.squaresX}
          onChange={(e) => set('squaresX', parseInt(e.target.value))}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
          <span>4</span><span>7</span><span>10</span><span>14</span>
        </div>
      </div>

      {/* Squares Y */}
      <div>
        <label className={labelClass}>Rows ({config.squaresY})</label>
        <input
          type="range"
          min={4}
          max={14}
          className="w-full mt-1"
          value={config.squaresY}
          onChange={(e) => set('squaresY', parseInt(e.target.value))}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
          <span>4</span><span>7</span><span>10</span><span>14</span>
        </div>
      </div>

      {/* Square size */}
      <div>
        <label className={labelClass}>Square Size (px)</label>
        <input
          type="number"
          min={10}
          max={200}
          step={5}
          className={inputClass}
          value={config.squareSize}
          onChange={(e) => set('squareSize', Math.max(10, parseInt(e.target.value) || 50))}
        />
      </div>

      {/* Add border */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => set('addBorder', !config.addBorder)}
          className={`relative w-10 h-5 rounded-full transition-all ${
            config.addBorder ? 'bg-primary' : 'bg-border'
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
              config.addBorder ? 'left-5' : 'left-0.5'
            }`}
          />
        </button>
        <label
          className="text-sm font-semibold text-foreground cursor-pointer"
          onClick={() => set('addBorder', !config.addBorder)}
        >
          Add white border
        </label>
      </div>

      {config.addBorder && (
        <div>
          <label className={labelClass}>Border Size (px)</label>
          <input
            type="number"
            min={5}
            max={100}
            step={5}
            className={inputClass}
            value={config.borderSize}
            onChange={(e) => set('borderSize', Math.max(5, parseInt(e.target.value) || 20))}
          />
        </div>
      )}

      {/* Info */}
      <div
        className="rounded-2xl px-3 py-2 text-xs text-muted-foreground"
        style={{ background: 'rgba(240, 235, 229, 0.6)' }}
      >
        {config.squaresX} × {config.squaresY} squares
        {' '}({config.squaresX * config.squareSize}×{config.squaresY * config.squareSize}px)
        {config.addBorder && ` + ${config.borderSize}px border`}
      </div>
    </div>
  );
}

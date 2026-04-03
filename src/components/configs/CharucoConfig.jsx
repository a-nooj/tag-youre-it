import React from 'react';
import { ARUCO_DICTS } from '../../data/aruco_dicts.js';

const inputClass =
  'w-full px-3 py-2 rounded-full border border-border bg-white/50 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';
const labelClass = 'block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide';

const DICT_OPTIONS = [
  'DICT_4X4_50',
  'DICT_4X4_100',
  'DICT_5X5_50',
  'DICT_5X5_100',
  'DICT_6X6_50',
  'DICT_6X6_100',
  'DICT_7X7_50',
  'DICT_7X7_100',
  'DICT_ORIGINAL',
];

export default function CharucoConfig({ config, onChange }) {
  const set = (key, value) => onChange({ ...config, [key]: value });

  // Calculate number of black squares (where markers go)
  const blackSquares = Math.floor((config.squaresX * config.squaresY) / 2);

  return (
    <div className="space-y-4">
      {/* Squares X */}
      <div>
        <label className={labelClass}>Columns ({config.squaresX})</label>
        <input
          type="range"
          min={3}
          max={12}
          className="w-full mt-1"
          value={config.squaresX}
          onChange={(e) => set('squaresX', parseInt(e.target.value))}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
          <span>3</span><span>6</span><span>9</span><span>12</span>
        </div>
      </div>

      {/* Squares Y */}
      <div>
        <label className={labelClass}>Rows ({config.squaresY})</label>
        <input
          type="range"
          min={3}
          max={12}
          className="w-full mt-1"
          value={config.squaresY}
          onChange={(e) => set('squaresY', parseInt(e.target.value))}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
          <span>3</span><span>6</span><span>9</span><span>12</span>
        </div>
      </div>

      {/* Square size */}
      <div>
        <label className={labelClass}>Square Size (px)</label>
        <input
          type="number"
          min={30}
          max={200}
          step={5}
          className={inputClass}
          value={config.squareSize}
          onChange={(e) => set('squareSize', Math.max(30, parseInt(e.target.value) || 60))}
        />
      </div>

      {/* Marker size ratio */}
      <div>
        <label className={labelClass}>
          Marker Ratio ({(config.markerRatio * 100).toFixed(0)}% of square)
        </label>
        <input
          type="range"
          min={50}
          max={80}
          className="w-full mt-1"
          value={Math.round(config.markerRatio * 100)}
          onChange={(e) => set('markerRatio', parseInt(e.target.value) / 100)}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
          <span>50%</span><span>60%</span><span>70%</span><span>80%</span>
        </div>
      </div>

      {/* ArUco dictionary */}
      <div>
        <label className={labelClass}>ArUco Dictionary</label>
        <select
          className={inputClass}
          value={config.dictName}
          onChange={(e) => set('dictName', e.target.value)}
        >
          {DICT_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Start marker ID */}
      <div>
        <label className={labelClass}>Start Marker ID</label>
        <input
          type="number"
          min={0}
          max={Math.max(0, (ARUCO_DICTS[config.dictName]?.size || 50) - blackSquares)}
          className={inputClass}
          value={config.startMarkerId}
          onChange={(e) => set('startMarkerId', Math.max(0, parseInt(e.target.value) || 0))}
        />
      </div>

      {/* Border bits */}
      <div>
        <label className={labelClass}>ArUco Border ({config.borderBits} cell{config.borderBits > 1 ? 's' : ''})</label>
        <input
          type="range"
          min={1}
          max={2}
          className="w-full mt-1"
          value={config.borderBits}
          onChange={(e) => set('borderBits', parseInt(e.target.value))}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
          <span>1</span><span>2</span>
        </div>
      </div>

      {/* Info */}
      <div
        className="rounded-2xl px-3 py-2 text-xs text-muted-foreground"
        style={{ background: 'rgba(240, 235, 229, 0.6)' }}
      >
        {blackSquares} ArUco markers will be embedded (IDs {config.startMarkerId} – {config.startMarkerId + blackSquares - 1})
      </div>
    </div>
  );
}

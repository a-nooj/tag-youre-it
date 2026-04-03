import React from 'react';
import { ARUCO_DICTS } from '../../data/aruco_dicts.js';

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

const inputClass =
  'w-full px-3 py-2 rounded-full border border-border bg-white/50 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';
const labelClass = 'block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide';

export default function ArucoConfig({ config, onChange }) {
  const dict = ARUCO_DICTS[config.dictName];
  const maxId = dict ? dict.size - 1 : 49;

  const set = (key, value) => onChange({ ...config, [key]: value });

  return (
    <div className="space-y-4">
      {/* Dictionary */}
      <div>
        <label className={labelClass}>Dictionary</label>
        <select
          className={inputClass}
          value={config.dictName}
          onChange={(e) => {
            const newDict = ARUCO_DICTS[e.target.value];
            set('dictName', e.target.value);
            // Clamp marker ID if out of range
            if (config.markerId >= newDict.size) {
              onChange({ ...config, dictName: e.target.value, markerId: 0 });
            }
          }}
        >
          {DICT_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Mode toggle */}
      <div>
        <label className={labelClass}>Mode</label>
        <div className="flex gap-2">
          {['single', 'sheet'].map((m) => (
            <button
              key={m}
              onClick={() => set('mode', m)}
              className={`flex-1 py-2 rounded-full text-sm font-semibold border transition-all
                ${config.mode === m
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-white/50 text-muted-foreground border-border hover:border-primary/50'
                }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {config.mode === 'single' ? (
        <>
          {/* Marker ID */}
          <div>
            <label className={labelClass}>Marker ID (0 – {maxId})</label>
            <input
              type="number"
              min={0}
              max={maxId}
              className={inputClass}
              value={config.markerId}
              onChange={(e) => set('markerId', Math.min(maxId, Math.max(0, parseInt(e.target.value) || 0)))}
            />
          </div>

          {/* Marker size */}
          <div>
            <label className={labelClass}>Marker Size (px)</label>
            <input
              type="number"
              min={50}
              max={1000}
              step={10}
              className={inputClass}
              value={config.markerSize}
              onChange={(e) => set('markerSize', Math.max(50, parseInt(e.target.value) || 200))}
            />
          </div>

          {/* Physical size mm */}
          <div>
            <label className={labelClass}>Physical Size (mm, for SVG/PDF)</label>
            <input
              type="number"
              min={5}
              max={500}
              className={inputClass}
              value={config.physicalSizeMm}
              onChange={(e) => set('physicalSizeMm', Math.max(5, parseInt(e.target.value) || 50))}
            />
          </div>

          {/* Border bits */}
          <div>
            <label className={labelClass}>Border Width ({config.borderBits} cell{config.borderBits > 1 ? 's' : ''})</label>
            <input
              type="range"
              min={1}
              max={4}
              className="w-full mt-1"
              value={config.borderBits}
              onChange={(e) => set('borderBits', parseInt(e.target.value))}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
              <span>1</span><span>2</span><span>3</span><span>4</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Sheet mode */}
          <div>
            <label className={labelClass}>Start ID</label>
            <input
              type="number"
              min={0}
              max={maxId}
              className={inputClass}
              value={config.sheetStartId}
              onChange={(e) => set('sheetStartId', Math.min(maxId, Math.max(0, parseInt(e.target.value) || 0)))}
            />
          </div>
          <div>
            <label className={labelClass}>Count (max 50)</label>
            <input
              type="number"
              min={1}
              max={Math.min(50, maxId - config.sheetStartId + 1)}
              className={inputClass}
              value={config.sheetCount}
              onChange={(e) => set('sheetCount', Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            />
          </div>
          <div>
            <label className={labelClass}>Columns ({config.sheetCols})</label>
            <input
              type="range"
              min={2}
              max={8}
              className="w-full mt-1"
              value={config.sheetCols}
              onChange={(e) => set('sheetCols', parseInt(e.target.value))}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
              <span>2</span><span>4</span><span>6</span><span>8</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Marker Size (px)</label>
            <input
              type="number"
              min={40}
              max={400}
              step={10}
              className={inputClass}
              value={config.markerSize}
              onChange={(e) => set('markerSize', Math.max(40, parseInt(e.target.value) || 100))}
            />
          </div>
          <div>
            <label className={labelClass}>Gap (px)</label>
            <input
              type="number"
              min={0}
              max={50}
              className={inputClass}
              value={config.sheetGap}
              onChange={(e) => set('sheetGap', Math.max(0, parseInt(e.target.value) || 10))}
            />
          </div>
          <div>
            <label className={labelClass}>Border Width ({config.borderBits} cell{config.borderBits > 1 ? 's' : ''})</label>
            <input
              type="range"
              min={1}
              max={4}
              className="w-full mt-1"
              value={config.borderBits}
              onChange={(e) => set('borderBits', parseInt(e.target.value))}
            />
          </div>
        </>
      )}
    </div>
  );
}

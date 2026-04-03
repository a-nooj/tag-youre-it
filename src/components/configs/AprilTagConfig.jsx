import React from 'react';
import { APRILTAG_FAMILIES } from '../../data/apriltag_families.js';

const inputClass =
  'w-full px-3 py-2 rounded-full border border-border bg-white/50 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';
const labelClass = 'block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide';

export default function AprilTagConfig({ config, onChange }) {
  const family = APRILTAG_FAMILIES[config.family];
  const maxId = family ? family.size - 1 : 29;

  const set = (key, value) => onChange({ ...config, [key]: value });

  return (
    <div className="space-y-4">
      {/* Family */}
      <div>
        <label className={labelClass}>Tag Family</label>
        <select
          className={inputClass}
          value={config.family}
          onChange={(e) => {
            const newFamily = APRILTAG_FAMILIES[e.target.value];
            const newMaxId = newFamily ? newFamily.size - 1 : 29;
            onChange({
              ...config,
              family: e.target.value,
              tagId: Math.min(config.tagId, newMaxId),
            });
          }}
        >
          {Object.keys(APRILTAG_FAMILIES).map((f) => (
            <option key={f} value={f}>
              {f} ({APRILTAG_FAMILIES[f].size} tags)
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
          <div>
            <label className={labelClass}>Tag ID (0 – {maxId})</label>
            <input
              type="number"
              min={0}
              max={maxId}
              className={inputClass}
              value={config.tagId}
              onChange={(e) => set('tagId', Math.min(maxId, Math.max(0, parseInt(e.target.value) || 0)))}
            />
          </div>

          <div>
            <label className={labelClass}>Tag Size (px)</label>
            <input
              type="number"
              min={50}
              max={1000}
              step={10}
              className={inputClass}
              value={config.tagSize}
              onChange={(e) => set('tagSize', Math.max(50, parseInt(e.target.value) || 200))}
            />
          </div>

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
        </>
      ) : (
        <>
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
            <label className={labelClass}>Tag Size (px)</label>
            <input
              type="number"
              min={40}
              max={400}
              step={10}
              className={inputClass}
              value={config.tagSize}
              onChange={(e) => set('tagSize', Math.max(40, parseInt(e.target.value) || 100))}
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
        </>
      )}
    </div>
  );
}

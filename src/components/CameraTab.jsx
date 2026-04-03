import React from 'react';
import { Camera, Play, Square, RefreshCw, ScanLine } from 'lucide-react';
import MarkerTypeTabs from './MarkerTypeTabs.jsx';
import { useCamera } from '../hooks/useCamera.js';

const DICT_OPTIONS = [
  { value: 'DICT_4X4_50', label: '4×4 (50 markers)' },
  { value: 'DICT_4X4_100', label: '4×4 (100 markers)' },
  { value: 'DICT_5X5_50', label: '5×5 (50 markers)' },
  { value: 'DICT_5X5_100', label: '5×5 (100 markers)' },
  { value: 'DICT_6X6_50', label: '6×6 (50 markers)' },
  { value: 'DICT_6X6_100', label: '6×6 (100 markers)' },
  { value: 'DICT_7X7_50', label: '7×7 (50 markers)' },
  { value: 'DICT_7X7_100', label: '7×7 (100 markers)' },
  { value: 'DICT_ORIGINAL', label: 'Original (1024 markers)' },
];

const labelClass = 'block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide';
const inputClass =
  'w-full px-3 py-2 rounded-full border border-border bg-white/50 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all';

// ──────────────────────────────────────────────────────────────────────────────
// Pill button
// ──────────────────────────────────────────────────────────────────────────────
function Btn({ onClick, children, variant = 'primary', disabled, className = '' }) {
  const variants = {
    primary: 'bg-primary text-primary-foreground border-primary hover:bg-primary/90',
    danger: 'bg-destructive text-white border-destructive hover:bg-destructive/90',
    ghost: 'bg-white/60 text-foreground border-border hover:bg-muted',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold border
        transition-all duration-200 hover:scale-105 active:scale-95
        disabled:opacity-40 disabled:pointer-events-none
        ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Camera card (mirrors calibration-tool's cam-card UX)
// ──────────────────────────────────────────────────────────────────────────────
function CameraCard({ camera, isSelected, onSelect }) {
  const label = camera.label || `Camera ${camera.deviceId.slice(0, 6)}…`;
  return (
    <button
      onClick={() => onSelect(camera.deviceId)}
      className={`w-full text-left flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200
        ${isSelected
          ? 'border-primary bg-primary/8 shadow-soft'
          : 'border-border/50 bg-white/40 hover:border-primary/40 hover:bg-white/70'}`}
    >
      <div
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: isSelected ? 'rgba(93,112,82,0.15)' : 'rgba(222,216,207,0.5)' }}
      >
        <Camera size={18} color={isSelected ? '#5D7052' : '#78786C'} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground truncate">{label}</div>
        <div className="text-xs text-muted-foreground">{camera.kind}</div>
      </div>
      {isSelected && (
        <span className="flex-shrink-0 text-xs font-bold text-primary">✓ Active</span>
      )}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Detection result badge
// ──────────────────────────────────────────────────────────────────────────────
function DetectionBadge({ id, hammingDistance }) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 rounded-xl border"
      style={{
        background: 'rgba(93, 112, 82, 0.08)',
        borderColor: 'rgba(93, 112, 82, 0.2)',
      }}
    >
      <span className="text-sm font-bold text-foreground" style={{ fontFamily: 'Fraunces, serif' }}>
        ID {id}
      </span>
      {hammingDistance > 0 && (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(193, 140, 93, 0.15)', color: '#C18C5D' }}
        >
          Δ{hammingDistance} bit{hammingDistance > 1 ? 's' : ''}
        </span>
      )}
      {hammingDistance === 0 && (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(93, 112, 82, 0.12)', color: '#5D7052' }}
        >
          exact
        </span>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main CameraTab
// ──────────────────────────────────────────────────────────────────────────────
export default function CameraTab({ activeTab, onTabChange }) {
  const {
    cameras,
    selectedDeviceId,
    changeCamera,
    dictName,
    setDictName,
    isStreaming,
    startStream,
    stopStream,
    detections,
    error,
    videoRef,
    canvasRef,
  } = useCamera();

  const cardStyle = {
    background: '#FEFEFA',
    borderColor: 'rgba(222, 216, 207, 0.5)',
    boxShadow: '0 4px 20px -2px rgba(93, 112, 82, 0.15)',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* ── LEFT PANEL ──────────────────────────────────────────────────────── */}
      <aside
        className="w-full lg:w-96 flex-shrink-0"
        style={{ position: 'sticky', top: '1.5rem', alignSelf: 'flex-start', maxHeight: 'calc(100vh - 5rem)', overflowY: 'auto' }}
      >
        <div className="rounded-3xl border p-6 space-y-5" style={cardStyle}>
          {/* Marker type tabs */}
          <MarkerTypeTabs activeTab={activeTab} onChange={onTabChange} />

          <div className="border-t border-border/40" />

          {/* Camera selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: 'Fraunces, serif' }}>
                Camera
              </h2>
              <button
                onClick={() =>
                  navigator.mediaDevices
                    .enumerateDevices()
                    .then((d) => d.filter((x) => x.kind === 'videoinput'))
                    .catch(() => [])
                }
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                title="Rescan cameras"
              >
                <RefreshCw size={12} />
                Rescan
              </button>
            </div>

            {cameras.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No cameras found yet. Click Start to request access.
              </p>
            ) : (
              <div className="space-y-2">
                {cameras.map((cam) => (
                  <CameraCard
                    key={cam.deviceId}
                    camera={cam}
                    isSelected={selectedDeviceId === cam.deviceId}
                    onSelect={changeCamera}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Dictionary */}
          <div>
            <label className={labelClass}>ArUco Dictionary</label>
            <select
              value={dictName}
              onChange={(e) => setDictName(e.target.value)}
              className={inputClass}
              style={{ appearance: 'auto' }}
            >
              {DICT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1.5">
              Must match the dictionary used to generate the marker.
            </p>
          </div>

          <div className="border-t border-border/40" />

          {/* Start / Stop */}
          {!isStreaming ? (
            <Btn onClick={startStream} className="w-full">
              <Play size={16} />
              Start Camera
            </Btn>
          ) : (
            <Btn onClick={stopStream} variant="danger" className="w-full">
              <Square size={16} />
              Stop Camera
            </Btn>
          )}

          {error && (
            <p className="text-xs font-medium text-destructive bg-destructive/8 rounded-2xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Detections */}
          {isStreaming && (
            <>
              <div className="border-t border-border/40" />
              <div>
                <h2 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: 'Fraunces, serif' }}>
                  Detected
                  {detections.length > 0 && (
                    <span
                      className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(93,112,82,0.12)', color: '#5D7052' }}
                    >
                      {detections.length}
                    </span>
                  )}
                </h2>
                {detections.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    Point the camera at an ArUco marker…
                  </p>
                ) : (
                  <div className="space-y-2">
                    {detections.map((d, i) => (
                      <DetectionBadge key={i} id={d.id} hammingDistance={d.hammingDistance} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Note about AprilTags */}
          <div className="border-t border-border/40" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>ArUco only.</strong> AprilTag detection requires a separate WASM library and isn't included. The orange corner dot marks corner 0 (orientation reference).
          </p>
        </div>
      </aside>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0">
        <div className="rounded-3xl border overflow-hidden" style={cardStyle}>
          {/* Hidden video element — we draw its frames onto the canvas ourselves */}
          <video ref={videoRef} playsInline muted style={{ display: 'none' }} />

          {isStreaming ? (
            <canvas
              ref={canvasRef}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                imageRendering: 'auto',
              }}
            />
          ) : (
            /* Placeholder */
            <div
              className="flex flex-col items-center justify-center gap-4 text-center"
              style={{ minHeight: '480px', padding: '3rem' }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(93, 112, 82, 0.08)' }}
              >
                <ScanLine size={40} color="#5D7052" strokeWidth={1.5} />
              </div>
              <div>
                <p
                  className="text-xl font-bold text-foreground mb-2"
                  style={{ fontFamily: 'Fraunces, serif' }}
                >
                  Live Detection
                </p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Select a camera and dictionary, then click <strong>Start Camera</strong> to begin detecting ArUco markers in real time.
                </p>
              </div>
              {error && (
                <p className="text-sm font-medium text-destructive max-w-sm">{error}</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import React from 'react';

// Inline SVG icons keep the bundle lean — no extra lucide imports here
const Icons = {
  aruco: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" opacity=".9"/>
      <rect x="9" y="1" width="5" height="5" rx="1" fill="currentColor" opacity=".9"/>
      <rect x="1" y="9" width="5" height="5" rx="1" fill="currentColor" opacity=".9"/>
      <rect x="9" y="9" width="2" height="2" rx=".4" fill="currentColor" opacity=".5"/>
      <rect x="12" y="9" width="2" height="2" rx=".4" fill="currentColor" opacity=".9"/>
      <rect x="9" y="12" width="2" height="2" rx=".4" fill="currentColor" opacity=".9"/>
      <rect x="12" y="12" width="2" height="2" rx=".4" fill="currentColor" opacity=".5"/>
    </svg>
  ),
  apriltag: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 2h11v11H2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M4 4h7v7H4z" stroke="currentColor" strokeWidth="1" fill="none" opacity=".5"/>
      <rect x="5.5" y="5.5" width="4" height="4" fill="currentColor" opacity=".7"/>
    </svg>
  ),
  charuco: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="4" height="4" fill="currentColor"/>
      <rect x="5" y="5" width="4" height="4" fill="currentColor"/>
      <rect x="9" y="1" width="4" height="4" fill="currentColor"/>
      <rect x="1" y="9" width="4" height="4" fill="currentColor"/>
      <rect x="9" y="9" width="4" height="4" fill="currentColor"/>
      <rect x="5" y="1" width="4" height="4" fill="none" stroke="currentColor" strokeWidth="1" opacity=".3"/>
      <rect x="1" y="5" width="4" height="4" fill="none" stroke="currentColor" strokeWidth="1" opacity=".3"/>
    </svg>
  ),
  chessboard: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="3" height="3" fill="currentColor"/>
      <rect x="7" y="1" width="3" height="3" fill="currentColor"/>
      <rect x="4" y="4" width="3" height="3" fill="currentColor"/>
      <rect x="10" y="4" width="3" height="3" fill="currentColor"/>
      <rect x="1" y="7" width="3" height="3" fill="currentColor"/>
      <rect x="7" y="7" width="3" height="3" fill="currentColor"/>
      <rect x="4" y="10" width="3" height="3" fill="currentColor"/>
      <rect x="10" y="10" width="3" height="3" fill="currentColor"/>
    </svg>
  ),
  camera: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M1 4.5A1.5 1.5 0 012.5 3h1l1-2h5l1 2h1A1.5 1.5 0 0114 4.5v7A1.5 1.5 0 0112.5 13h-10A1.5 1.5 0 011 11.5v-7z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <circle cx="7.5" cy="8" r="2.3" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    </svg>
  ),
};

const TABS = [
  { id: 'aruco',      label: 'ArUco' },
  { id: 'apriltag',   label: 'AprilTag' },
  { id: 'charuco',    label: 'ChArUco' },
  { id: 'chessboard', label: 'Chessboard' },
  { id: 'camera',     label: 'Camera' },
];

export default function MarkerTypeTabs({ activeTab, onChange }) {
  return (
    <nav className="space-y-1" aria-label="Marker type">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-200 text-left
              ${isActive
                ? 'bg-white text-primary shadow-soft border border-border/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/60 border border-transparent'
              }
            `}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            <span className={isActive ? 'text-primary' : 'text-muted-foreground'}>
              {Icons[tab.id]}
            </span>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

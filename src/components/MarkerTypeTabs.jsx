import React from 'react';

const TABS = [
  { id: 'aruco', label: 'ArUco' },
  { id: 'apriltag', label: 'AprilTag' },
  { id: 'charuco', label: 'ChArUco' },
  { id: 'chessboard', label: 'Chessboard' },
];

export default function MarkerTypeTabs({ activeTab, onChange }) {
  return (
    <div className="flex gap-1 p-1 rounded-2xl bg-muted border border-border/40">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex-1 text-xs font-semibold py-2 px-2 rounded-xl
              transition-all duration-200
              ${isActive
                ? 'bg-white text-primary shadow-soft border border-border/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
              }
            `}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

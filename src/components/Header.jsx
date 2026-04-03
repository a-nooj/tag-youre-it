import React from 'react';

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-background border-b border-border/50 py-8 px-6">
      {/* Blob decorations */}
      <div
        className="absolute -top-16 -left-16 w-64 h-64 blur-3xl pointer-events-none"
        style={{
          background: 'rgba(93, 112, 82, 0.12)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        }}
      />
      <div
        className="absolute -top-8 right-32 w-48 h-48 blur-3xl pointer-events-none"
        style={{
          background: 'rgba(193, 140, 93, 0.14)',
          borderRadius: '40% 60% 70% 30% / 50% 60% 40% 60%',
        }}
      />
      <div
        className="absolute top-4 right-8 w-32 h-32 blur-2xl pointer-events-none"
        style={{
          background: 'rgba(93, 112, 82, 0.08)',
          borderRadius: '70% 30% 60% 40% / 40% 70% 30% 60%',
        }}
      />

      <div className="relative max-w-7xl mx-auto flex items-center gap-4">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl"
          style={{ background: 'rgba(93, 112, 82, 0.12)' }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="10" height="10" rx="1.5" fill="#5D7052" />
            <rect x="16" y="2" width="10" height="10" rx="1.5" fill="#5D7052" />
            <rect x="2" y="16" width="10" height="10" rx="1.5" fill="#5D7052" />
            <rect x="16" y="16" width="4" height="4" rx="0.5" fill="#C18C5D" />
            <rect x="22" y="16" width="4" height="4" rx="0.5" fill="#5D7052" />
            <rect x="16" y="22" width="4" height="4" rx="0.5" fill="#5D7052" />
            <rect x="22" y="22" width="4" height="4" rx="0.5" fill="#C18C5D" />
          </svg>
        </div>

        <div>
          <h1
            className="text-2xl md:text-3xl text-foreground leading-tight"
            style={{ fontFamily: 'Fraunces, serif', fontWeight: 700 }}
          >
            Tag, You're It
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Fiducial marker generator — ArUco, AprilTag, ChArUco & Chessboard
          </p>
        </div>

        {/* Badge */}
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <span
            className="px-3 py-1 text-xs font-semibold rounded-full"
            style={{
              background: 'rgba(93, 112, 82, 0.1)',
              color: '#5D7052',
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            Open Source
          </span>
        </div>
      </div>
    </header>
  );
}

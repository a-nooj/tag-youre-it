import React from 'react';

const INFO = {
  aruco: {
    title: 'ArUco Markers',
    color: '#5D7052',
    tips: [
      'Print at the recommended physical size for your application.',
      'Use a 1-cell border (default) for most detectors.',
      'Higher dictionary numbers (6x6, 7x7) allow more unique IDs with fewer false positives.',
      'DICT_ORIGINAL is the classic OpenCV ArUco dictionary (25-bit, 1024 markers).',
      'For robotics: 150–200mm markers work well at 1–3m distance.',
      'Laminate or mount on rigid board for best detection.',
    ],
    sizes: [
      { use: 'Close range (< 50cm)', size: '50–80mm' },
      { use: 'Medium range (50cm–2m)', size: '100–150mm' },
      { use: 'Long range (2–5m)', size: '200–300mm' },
    ],
  },
  apriltag: {
    title: 'AprilTag Markers',
    color: '#C18C5D',
    tips: [
      'AprilTags are highly robust to partial occlusion and extreme lighting.',
      'tag36h11 offers the most unique IDs (587 tags) with the best error correction.',
      'tag16h5 is the smallest (6×6 total) — good for space-constrained applications.',
      'tag25h9 balances size and ID count (35 tags).',
      'Print on matte paper to reduce glare.',
      'Avoid scaling below 30mm for reliable detection.',
    ],
    sizes: [
      { use: 'Mobile robotics', size: '80–120mm' },
      { use: 'Indoor navigation', size: '150–200mm' },
      { use: 'Drone landing', size: '300–500mm' },
    ],
  },
  charuco: {
    title: 'ChArUco Boards',
    color: '#7A6B8A',
    tips: [
      'ChArUco combines chessboard accuracy with ArUco robustness.',
      'Use for camera calibration — each corner can be uniquely identified.',
      'A 7×5 board with 40mm squares is a common calibration setup.',
      'Ensure the marker size is at most 80% of the square size for reliable detection.',
      'Print on flat, non-reflective surface and mount on rigid board.',
      'Take 20+ photos at various angles and distances for calibration.',
    ],
    sizes: [
      { use: 'Webcam calibration', size: '30–50mm squares' },
      { use: 'Wide-angle lens', size: '50–80mm squares' },
      { use: 'Stereo calibration', size: '40–60mm squares' },
    ],
  },
  chessboard: {
    title: 'Chessboard Pattern',
    color: '#3A3A35',
    tips: [
      'Classic chessboard for OpenCV camera calibration (cv2.findChessboardCorners).',
      'Internal corner count: (squaresX-1) × (squaresY-1).',
      'A 9×6 board (8×5 internal corners) is the OpenCV default example.',
      'Use an odd×even board to help determine orientation.',
      'Print with a white border around the board for edge detection.',
      'Mount on a hard flat surface — warping causes calibration errors.',
    ],
    sizes: [
      { use: 'Standard webcam', size: '25–35mm squares' },
      { use: 'Action camera', size: '30–50mm squares' },
      { use: 'Wide field-of-view', size: '40–60mm squares' },
    ],
  },
};

export default function InfoPanel({ markerType }) {
  const info = INFO[markerType] || INFO.aruco;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: info.color }}
        />
        <h3
          className="text-base font-bold text-foreground"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          {info.title} — Tips & Guidelines
        </h3>
      </div>

      {/* Tips */}
      <div className="space-y-1.5">
        {info.tips.map((tip, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span
              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
              style={{ background: `${info.color}18`, color: info.color }}
            >
              {i + 1}
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>

      {/* Recommended sizes */}
      <div
        className="rounded-2xl p-4"
        style={{ background: 'rgba(240, 235, 229, 0.5)' }}
      >
        <h4
          className="text-xs font-bold uppercase tracking-wide mb-3"
          style={{ color: info.color, fontFamily: 'Nunito, sans-serif' }}
        >
          Recommended Sizes
        </h4>
        <div className="space-y-2">
          {info.sizes.map((s, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{s.use}</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${info.color}15`, color: info.color }}
              >
                {s.size}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Print tips */}
      <div
        className="rounded-2xl p-3 flex gap-2 items-start"
        style={{ background: 'rgba(93, 112, 82, 0.06)', border: '1px solid rgba(93, 112, 82, 0.15)' }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5D7052"
          strokeWidth="2"
          className="flex-shrink-0 mt-0.5"
        >
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>
        <p className="text-xs text-muted-foreground leading-relaxed">
          For print: use PNG at 300+ DPI or SVG for best quality. Set the physical size
          in the PDF export to match your intended print size for accurate scaling.
        </p>
      </div>
    </div>
  );
}

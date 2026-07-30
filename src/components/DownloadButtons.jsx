import React, { useState } from 'react';
import { downloadSVG, downloadPNG, downloadPDF } from '../utils/export.js';
import { getArucoSVG } from '../renderers/aruco.js';
import { getAprilTagSVG } from '../renderers/apriltag.js';
import { ARUCO_DICTS } from '../data/aruco_dicts.js';
import { APRILTAG_FAMILIES } from '../data/apriltag_families.js';

const DPI_OPTIONS = [72, 150, 300, 600];

export default function DownloadButtons({ markerType, config, canvasRef }) {
  const [dpi, setDpi] = useState(300);
  const [pdfWidth, setPdfWidth] = useState(50);

  const getFilename = (ext) => {
    let base = markerType;
    if (markerType === 'aruco') {
      base = `aruco_${config.dictName}_id${config.mode === 'single' ? config.markerId : `${config.sheetStartId}-${config.sheetStartId + config.sheetCount - 1}`}`;
    } else if (markerType === 'apriltag') {
      base = `apriltag_${config.family}_id${config.mode === 'single' ? config.tagId : `${config.sheetStartId}-${config.sheetStartId + config.sheetCount - 1}`}`;
    } else if (markerType === 'charuco') {
      base = `charuco_${config.squaresX}x${config.squaresY}`;
    } else if (markerType === 'chessboard') {
      base = `chessboard_${config.squaresX}x${config.squaresY}`;
    }
    return `${base}.${ext}`;
  };

  const getSVGString = () => {
    if (markerType === 'aruco' && config.mode === 'single') {
      const dict = ARUCO_DICTS[config.dictName];
      if (!dict) return null;
      const id = Math.min(config.markerId, dict.data.length - 1);
      return getArucoSVG(dict.data[id], dict.gridN, config.physicalSizeMm, config.borderBits);
    }
    if (markerType === 'apriltag' && config.mode === 'single') {
      const family = APRILTAG_FAMILIES[config.family];
      if (!family) return null;
      const id = Math.min(config.tagId, family.data.length - 1);
      return getAprilTagSVG(family.data[id], family.dataGridN, config.physicalSizeMm);
    }
    return null;
  };

  const svgAvailable = (markerType === 'aruco' || markerType === 'apriltag') && config.mode === 'single';

  const handleSVG = () => {
    if (!svgAvailable) return;
    const svg = getSVGString();
    if (svg) downloadSVG(svg, getFilename('svg'));
  };

  const handlePNG = () => {
    if (!canvasRef || !canvasRef.current) return;
    downloadPNG(canvasRef.current, getFilename('png'), dpi);
  };

  const handlePDF = () => {
    const canvas = canvasRef?.current;
    if (!canvas) return;
    const aspect = canvas.height / canvas.width;
    const pdfHeight = Math.round(pdfWidth * aspect * 10) / 10;
    downloadPDF(canvas, getFilename('pdf'), pdfWidth, pdfHeight);
  };

  const btnBase =
    'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold transition-all border';

  return (
    <div className="space-y-4">
      {/* Main download buttons */}
      <div className="flex gap-2">
        {/* SVG */}
        <button
          onClick={handleSVG}
          disabled={!svgAvailable}
          aria-disabled={!svgAvailable}
          className={`${btnBase} ${
            svgAvailable
              ? 'bg-white text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 active:scale-95'
              : 'bg-white/40 text-muted-foreground border-border cursor-not-allowed opacity-60'
          }`}
          title={svgAvailable ? 'Download SVG' : 'SVG export is only available for single-marker ArUco/AprilTag mode'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          SVG
        </button>

        {/* PNG */}
        <button
          onClick={handlePNG}
          className={`${btnBase} hover:scale-105 active:scale-95 bg-primary text-primary-foreground border-primary hover:bg-primary/90`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          PNG
        </button>

        {/* PDF */}
        <button
          onClick={handlePDF}
          className={`${btnBase} hover:scale-105 active:scale-95 bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/90`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          PDF
        </button>
      </div>

      {/* DPI selector for PNG */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          PNG DPI
        </label>
        <div className="flex gap-2">
          {DPI_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDpi(d)}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold border transition-all
                ${dpi === d
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-white/50 text-muted-foreground border-border hover:border-primary/40'
                }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Physical size for PDF */}
      <div>
        <label htmlFor="pdf-width" className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          PDF Width (mm) — height auto-scales
        </label>
        <div className="flex gap-2 items-center">
          <input
            id="pdf-width"
            type="number"
            min={5}
            max={1000}
            value={pdfWidth}
            onChange={(e) => setPdfWidth(Math.max(5, parseInt(e.target.value) || 50))}
            className="flex-1 px-3 py-2 rounded-full border border-border bg-white/50 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Width mm"
          />
          <span className="text-muted-foreground text-sm font-medium">×</span>
          <div className="flex-1 px-3 py-2 rounded-full border border-border/40 bg-muted/40 text-sm text-muted-foreground select-none">
            {canvasRef?.current
              ? `${Math.round(pdfWidth * (canvasRef.current.height / canvasRef.current.width) * 10) / 10} mm`
              : '— mm'}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Height is locked to the canvas aspect ratio. A4 width = 210 mm.
        </p>
      </div>
    </div>
  );
}

import React, { useRef, useEffect, useCallback } from 'react';
import { renderArucoMarker } from '../renderers/aruco.js';
import { getArucoSheet } from '../renderers/aruco.js';
import { renderAprilTagMarker, getAprilTagSheet } from '../renderers/apriltag.js';
import { renderCharucoBoard } from '../renderers/charuco.js';
import { renderChessboard, getChessboardDimensions } from '../renderers/chessboard.js';
import { ARUCO_DICTS } from '../data/aruco_dicts.js';
import { APRILTAG_FAMILIES } from '../data/apriltag_families.js';

export default function PreviewCanvas({ markerType, config, onCanvasReady }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const renderToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (markerType === 'aruco') {
      const dict = ARUCO_DICTS[config.dictName];
      if (!dict) return;

      if (config.mode === 'single') {
        const id = Math.min(config.markerId, dict.data.length - 1);
        const size = config.markerSize;
        canvas.width = size;
        canvas.height = size;
        renderArucoMarker(ctx, dict.data[id], dict.gridN, size, config.borderBits);
      } else {
        // Sheet mode
        const ids = [];
        for (let i = 0; i < config.sheetCount; i++) {
          const id = config.sheetStartId + i;
          if (id < dict.data.length) ids.push(id);
        }
        const sheetCanvas = getArucoSheet(dict, ids, config.sheetCols, config.markerSize, config.sheetGap, config.borderBits);
        canvas.width = sheetCanvas.width;
        canvas.height = sheetCanvas.height;
        ctx.drawImage(sheetCanvas, 0, 0);
      }
    } else if (markerType === 'apriltag') {
      const family = APRILTAG_FAMILIES[config.family];
      if (!family) return;

      if (config.mode === 'single') {
        const id = Math.min(config.tagId, family.data.length - 1);
        const size = config.tagSize;
        canvas.width = size;
        canvas.height = size;
        renderAprilTagMarker(ctx, family.data[id], family.dataGridN, size);
      } else {
        const ids = [];
        for (let i = 0; i < config.sheetCount; i++) {
          const id = config.sheetStartId + i;
          if (id < family.data.length) ids.push(id);
        }
        const sheetCanvas = getAprilTagSheet(family, ids, config.sheetCols, config.tagSize, config.sheetGap);
        canvas.width = sheetCanvas.width;
        canvas.height = sheetCanvas.height;
        ctx.drawImage(sheetCanvas, 0, 0);
      }
    } else if (markerType === 'charuco') {
      const dict = ARUCO_DICTS[config.dictName];
      if (!dict) return;
      const markerSizePx = Math.floor(config.squareSize * config.markerRatio);
      const boardW = config.squaresX * config.squareSize;
      const boardH = config.squaresY * config.squareSize;
      canvas.width = boardW;
      canvas.height = boardH;
      renderCharucoBoard(
        ctx,
        config.squaresX,
        config.squaresY,
        config.squareSize,
        markerSizePx,
        dict,
        config.startMarkerId,
        config.borderBits
      );
    } else if (markerType === 'chessboard') {
      const dims = getChessboardDimensions(
        config.squaresX,
        config.squaresY,
        config.squareSize,
        config.addBorder,
        config.borderSize
      );
      canvas.width = dims.width;
      canvas.height = dims.height;
      renderChessboard(
        ctx,
        config.squaresX,
        config.squaresY,
        config.squareSize,
        config.addBorder,
        config.borderSize
      );
    }

    if (onCanvasReady) onCanvasReady(canvas);
  }, [markerType, config, onCanvasReady]);

  useEffect(() => {
    renderToCanvas();
  }, [renderToCanvas]);

  return (
    <div
      ref={containerRef}
      className="w-full flex items-center justify-center"
      style={{ minHeight: '200px' }}
    >
      <div
        className="relative rounded-3xl overflow-hidden shadow-float border border-border/30"
        style={{
          maxWidth: '500px',
          maxHeight: '500px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          padding: '16px',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            maxHeight: '468px',
            objectFit: 'contain',
            imageRendering: 'pixelated',
          }}
        />
      </div>
    </div>
  );
}

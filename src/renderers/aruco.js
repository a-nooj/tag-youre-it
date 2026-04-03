// ArUco marker renderer
// markerBits: flat array of bits, row-major, inner data region only (0=black, 1=white)
// gridN: inner grid size (e.g. 4 for 4x4 dict)
// totalSize: canvas pixels for the whole marker
// borderBits: how many cells thick the black border is (1-4)

export function renderArucoMarker(ctx, markerBits, gridN, totalSize, borderBits = 1) {
  const totalCells = gridN + 2 * borderBits;
  const cellSize = totalSize / totalCells;

  ctx.clearRect(0, 0, totalSize, totalSize);

  // Draw entire background white first
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, totalSize, totalSize);

  // Draw border cells (black)
  ctx.fillStyle = '#000000';
  for (let row = 0; row < totalCells; row++) {
    for (let col = 0; col < totalCells; col++) {
      const isBorder =
        row < borderBits ||
        row >= totalCells - borderBits ||
        col < borderBits ||
        col >= totalCells - borderBits;
      if (isBorder) {
        ctx.fillRect(
          Math.round(col * cellSize),
          Math.round(row * cellSize),
          Math.round(cellSize),
          Math.round(cellSize)
        );
      }
    }
  }

  // Draw inner data cells
  for (let row = 0; row < gridN; row++) {
    for (let col = 0; col < gridN; col++) {
      const bitIndex = row * gridN + col;
      const bitValue = markerBits[bitIndex];
      ctx.fillStyle = bitValue === 1 ? '#FFFFFF' : '#000000';
      ctx.fillRect(
        Math.round((col + borderBits) * cellSize),
        Math.round((row + borderBits) * cellSize),
        Math.round(cellSize),
        Math.round(cellSize)
      );
    }
  }
}

export function getArucoSVG(markerBits, gridN, physicalSizeMm, borderBits = 1) {
  const totalCells = gridN + 2 * borderBits;
  const cellSize = 10; // SVG units per cell
  const svgSize = totalCells * cellSize;
  const mmAttr = physicalSizeMm
    ? `width="${physicalSizeMm}mm" height="${physicalSizeMm}mm"`
    : `width="${svgSize}" height="${svgSize}"`;

  let rects = '';

  // White background
  rects += `<rect x="0" y="0" width="${svgSize}" height="${svgSize}" fill="white"/>`;

  // Border cells (black)
  for (let row = 0; row < totalCells; row++) {
    for (let col = 0; col < totalCells; col++) {
      const isBorder =
        row < borderBits ||
        row >= totalCells - borderBits ||
        col < borderBits ||
        col >= totalCells - borderBits;
      if (isBorder) {
        rects += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }

  // Inner data cells
  for (let row = 0; row < gridN; row++) {
    for (let col = 0; col < gridN; col++) {
      const bitIndex = row * gridN + col;
      const bitValue = markerBits[bitIndex];
      if (bitValue === 0) {
        rects += `<rect x="${(col + borderBits) * cellSize}" y="${(row + borderBits) * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" ${mmAttr}>${rects}</svg>`;
}

export function getArucoSheet(dict, ids, cols, markerSizePx, gap, borderBits = 1) {
  const rows = Math.ceil(ids.length / cols);
  const totalWidth = cols * markerSizePx + (cols + 1) * gap;
  const totalHeight = rows * markerSizePx + (rows + 1) * gap;

  const canvas = document.createElement('canvas');
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  ids.forEach((id, idx) => {
    if (id >= dict.data.length) return;
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = gap + col * (markerSizePx + gap);
    const y = gap + row * (markerSizePx + gap);

    const offscreen = document.createElement('canvas');
    offscreen.width = markerSizePx;
    offscreen.height = markerSizePx;
    const offCtx = offscreen.getContext('2d');
    renderArucoMarker(offCtx, dict.data[id], dict.gridN, markerSizePx, borderBits);
    ctx.drawImage(offscreen, x, y);

    // Label
    ctx.fillStyle = '#333333';
    ctx.font = `${Math.max(10, Math.floor(markerSizePx * 0.08))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`ID ${id}`, x + markerSizePx / 2, y + markerSizePx + gap * 0.75);
  });

  return canvas;
}

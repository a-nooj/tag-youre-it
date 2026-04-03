// AprilTag marker renderer
// AprilTag format (from outside in):
//   1. Outer black border (1 cell thick)
//   2. Inner white border (1 cell thick)
//   3. Data bits (dataGridN x dataGridN)
//
// So total grid = dataGridN + 4 cells (2 for outer black, 2 for inner white)
// tag16h5: dataGridN=4, totalGridN=6 (4+2 borders = 4+4 in cells? Wait...)
// Actually for tag16h5: 4x4 data, 1-cell outer black, 1-cell inner white
// Total = 4 + 2*1 + 2*1 = 4+4 = 8? No - totalGridN=6 from family data
// tag16h5 total is 6x6: outer border(1) + inner white(1) + data(4) + inner white(1) + outer border(1) = 8?
// No: 6 = 4 + 2 (one ring of black border only)
// Looking at spec: tag16h5 has 4x4 data, surrounded by 1 white and 1 black = 4+2+2=8?
// Actually the standard: outer black border 1 cell, then data. The "white border" is part of detection.
// In rendering, we draw: black outer border (1 cell), then white cells (1 cell ring), then data bits
// 4+2+2 = 8... but family says totalGridN=6
//
// Let me reconsider: AprilTag h5 layout is indeed 6x6 total
// Row/col 0,5: black border
// Row/col 1,4: white border
// Rows/cols 2-3: data (2x2)? No, it's 4x4 data...
//
// Actually for tag16h5: the 6x6 total includes 1-cell black border all around
// The bit_x/bit_y values go 1-4 (within the 6x6 outer border where 0 and 5 are border)
// So: col 0 = black, col 5 = black, row 0 = black, row 5 = black -> 4x4 data at positions 1-4
// There is NO separate white border in the basic tags! The white comes from the data bits.
// Wait but detection requires a white border for contrast...
//
// Looking at the actual AprilTag spec:
// The standard outer border is 1-cell black.
// For tag16h5 (6x6 total): positions (row/col 0 and 5) are black border, inner 4x4 is data
// There is no explicit "inner white border" - that's a myth for basic h5 tags
// The h refers to minimum Hamming distance, not border layers
//
// HOWEVER, for tag36h11 (8x8 total): bit_x/bit_y go 1-6 within 8x8
// So: 1-cell black border + 6x6 data = 8x8. No inner white border.
//
// For tag25h9 (7x7 total): bit_x/bit_y go 1-5 within 7x7
// So: 1-cell black border + 5x5 data = 7x7. No inner white border.
//
// Final understanding: AprilTag = 1-cell outer black border, data fills the rest
// The "inner white border" concept is from ArUco/ChArUco, not basic AprilTags

export function renderAprilTagMarker(ctx, dataBits, dataGridN, totalSize) {
  const totalCells = dataGridN + 2; // 1-cell black border each side
  const cellSize = totalSize / totalCells;

  ctx.clearRect(0, 0, totalSize, totalSize);

  // White background first
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, totalSize, totalSize);

  // Outer black border (1 cell)
  ctx.fillStyle = '#000000';
  for (let row = 0; row < totalCells; row++) {
    for (let col = 0; col < totalCells; col++) {
      const isBorder =
        row === 0 ||
        row === totalCells - 1 ||
        col === 0 ||
        col === totalCells - 1;
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

  // Data cells (offset by 1 for border)
  for (let row = 0; row < dataGridN; row++) {
    for (let col = 0; col < dataGridN; col++) {
      const bitIndex = row * dataGridN + col;
      const bitValue = dataBits[bitIndex];
      ctx.fillStyle = bitValue === 1 ? '#FFFFFF' : '#000000';
      ctx.fillRect(
        Math.round((col + 1) * cellSize),
        Math.round((row + 1) * cellSize),
        Math.round(cellSize),
        Math.round(cellSize)
      );
    }
  }
}

export function getAprilTagSVG(dataBits, dataGridN, physicalSizeMm) {
  const totalCells = dataGridN + 2;
  const cellSize = 10;
  const svgSize = totalCells * cellSize;
  const mmAttr = physicalSizeMm
    ? `width="${physicalSizeMm}mm" height="${physicalSizeMm}mm"`
    : `width="${svgSize}" height="${svgSize}"`;

  let rects = '';

  // White background
  rects += `<rect x="0" y="0" width="${svgSize}" height="${svgSize}" fill="white"/>`;

  // Outer black border
  for (let row = 0; row < totalCells; row++) {
    for (let col = 0; col < totalCells; col++) {
      const isBorder =
        row === 0 || row === totalCells - 1 || col === 0 || col === totalCells - 1;
      if (isBorder) {
        rects += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }

  // Data cells
  for (let row = 0; row < dataGridN; row++) {
    for (let col = 0; col < dataGridN; col++) {
      const bitIndex = row * dataGridN + col;
      const bitValue = dataBits[bitIndex];
      if (bitValue === 0) {
        rects += `<rect x="${(col + 1) * cellSize}" y="${(row + 1) * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" ${mmAttr}>${rects}</svg>`;
}

export function getAprilTagSheet(family, ids, cols, markerSizePx, gap) {
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
    if (id >= family.data.length) return;
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = gap + col * (markerSizePx + gap);
    const y = gap + row * (markerSizePx + gap);

    const offscreen = document.createElement('canvas');
    offscreen.width = markerSizePx;
    offscreen.height = markerSizePx;
    const offCtx = offscreen.getContext('2d');
    renderAprilTagMarker(offCtx, family.data[id], family.dataGridN, markerSizePx);
    ctx.drawImage(offscreen, x, y);

    // Label
    ctx.fillStyle = '#333333';
    ctx.font = `${Math.max(10, Math.floor(markerSizePx * 0.08))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`ID ${id}`, x + markerSizePx / 2, y + markerSizePx + gap * 0.75);
  });

  return canvas;
}

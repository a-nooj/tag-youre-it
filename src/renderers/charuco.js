import { renderArucoMarker } from './aruco.js';

// ChArUco board renderer
// squaresX: number of chessboard columns
// squaresY: number of chessboard rows
// squareSizePx: size of each chessboard square in pixels
// markerSizePx: size of the ArUco marker inside each black square
// arucoDict: the ArUco dictionary object { data, gridN, size }
// startMarkerId: ID of the first ArUco marker to embed
// borderBits: ArUco marker border thickness

export function renderCharucoBoard(
  ctx,
  squaresX,
  squaresY,
  squareSizePx,
  markerSizePx,
  arucoDict,
  startMarkerId = 0,
  borderBits = 1
) {
  const boardWidth = squaresX * squareSizePx;
  const boardHeight = squaresY * squareSizePx;

  ctx.clearRect(0, 0, boardWidth, boardHeight);

  // Fill background white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, boardWidth, boardHeight);

  let markerIdx = 0;

  for (let row = 0; row < squaresY; row++) {
    for (let col = 0; col < squaresX; col++) {
      const x = col * squareSizePx;
      const y = row * squareSizePx;

      // Determine if this square is black or white
      // Standard chessboard: (row+col) % 2 === 0 -> white in OpenCV convention
      // ChArUco uses (row+col) % 2 !== 0 as black squares for markers
      const isBlack = (row + col) % 2 !== 0;

      if (isBlack) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, squareSizePx, squareSizePx);

        // Embed ArUco marker if we have one
        const markerId = startMarkerId + markerIdx;
        if (markerId < arucoDict.data.length) {
          const markerBits = arucoDict.data[markerId];
          const clampedMarkerSize = Math.min(markerSizePx, squareSizePx);
          const offsetX = x + (squareSizePx - clampedMarkerSize) / 2;
          const offsetY = y + (squareSizePx - clampedMarkerSize) / 2;

          const offscreen = document.createElement('canvas');
          offscreen.width = clampedMarkerSize;
          offscreen.height = clampedMarkerSize;
          const offCtx = offscreen.getContext('2d');
          renderArucoMarker(offCtx, markerBits, arucoDict.gridN, clampedMarkerSize, borderBits);
          ctx.drawImage(offscreen, offsetX, offsetY);
        }

        markerIdx++;
      }
    }
  }
}

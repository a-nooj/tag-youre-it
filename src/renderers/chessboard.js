// Standard chessboard renderer
// squaresX: number of columns
// squaresY: number of rows
// squareSizePx: size of each square in pixels
// addBorder: whether to add a white border around the board
// borderSizePx: size of the border in pixels

export function renderChessboard(
  ctx,
  squaresX,
  squaresY,
  squareSizePx,
  addBorder = false,
  borderSizePx = 20
) {
  const boardW = squaresX * squareSizePx;
  const boardH = squaresY * squareSizePx;
  const totalW = addBorder ? boardW + 2 * borderSizePx : boardW;
  const totalH = addBorder ? boardH + 2 * borderSizePx : boardH;

  const offsetX = addBorder ? borderSizePx : 0;
  const offsetY = addBorder ? borderSizePx : 0;

  ctx.clearRect(0, 0, totalW, totalH);

  // White background (also serves as border if enabled)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, totalW, totalH);

  // Draw chessboard squares
  for (let row = 0; row < squaresY; row++) {
    for (let col = 0; col < squaresX; col++) {
      const isBlack = (row + col) % 2 !== 0;
      if (isBlack) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(
          offsetX + col * squareSizePx,
          offsetY + row * squareSizePx,
          squareSizePx,
          squareSizePx
        );
      }
    }
  }
}

export function getChessboardDimensions(squaresX, squaresY, squareSizePx, addBorder, borderSizePx) {
  const boardW = squaresX * squareSizePx;
  const boardH = squaresY * squareSizePx;
  return {
    width: addBorder ? boardW + 2 * borderSizePx : boardW,
    height: addBorder ? boardH + 2 * borderSizePx : boardH,
  };
}

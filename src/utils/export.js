import { jsPDF } from 'jspdf';

export function downloadSVG(svgString, filename) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Inject pHYs chunk into PNG for correct DPI
function injectPHYsChunk(pngBytes, dpi) {
  const pixelsPerMeter = Math.round(dpi * 39.3701);

  // pHYs chunk: length(4) + "pHYs"(4) + ppmX(4) + ppmY(4) + unit(1) + CRC(4) = 21 bytes total
  const chunkData = new Uint8Array(9);
  // X pixels per unit
  chunkData[0] = (pixelsPerMeter >>> 24) & 0xff;
  chunkData[1] = (pixelsPerMeter >>> 16) & 0xff;
  chunkData[2] = (pixelsPerMeter >>> 8) & 0xff;
  chunkData[3] = pixelsPerMeter & 0xff;
  // Y pixels per unit
  chunkData[4] = (pixelsPerMeter >>> 24) & 0xff;
  chunkData[5] = (pixelsPerMeter >>> 16) & 0xff;
  chunkData[6] = (pixelsPerMeter >>> 8) & 0xff;
  chunkData[7] = pixelsPerMeter & 0xff;
  // Unit = 1 (meter)
  chunkData[8] = 1;

  // Build the chunk: type bytes + data bytes
  const typeBytes = new Uint8Array([0x70, 0x48, 0x59, 0x73]); // "pHYs"
  const combined = new Uint8Array(typeBytes.length + chunkData.length);
  combined.set(typeBytes, 0);
  combined.set(chunkData, 4);

  const crc = crc32(combined);

  // Full chunk: length(4) + type(4) + data(9) + crc(4) = 21 bytes
  const physChunk = new Uint8Array(21);
  // Length = 9 (data portion only, not type)
  physChunk[0] = 0;
  physChunk[1] = 0;
  physChunk[2] = 0;
  physChunk[3] = 9;
  // Type "pHYs"
  physChunk[4] = 0x70;
  physChunk[5] = 0x48;
  physChunk[6] = 0x59;
  physChunk[7] = 0x73;
  // Data
  physChunk.set(chunkData, 8);
  // CRC
  physChunk[17] = (crc >>> 24) & 0xff;
  physChunk[18] = (crc >>> 16) & 0xff;
  physChunk[19] = (crc >>> 8) & 0xff;
  physChunk[20] = crc & 0xff;

  // Find the IDAT chunk position
  // PNG signature is 8 bytes, then chunks follow
  // Each chunk: length(4) + type(4) + data(length) + crc(4)
  let pos = 8; // skip PNG signature
  while (pos < pngBytes.length - 8) {
    const chunkLen =
      (pngBytes[pos] << 24) |
      (pngBytes[pos + 1] << 16) |
      (pngBytes[pos + 2] << 8) |
      pngBytes[pos + 3];
    const chunkType = String.fromCharCode(
      pngBytes[pos + 4],
      pngBytes[pos + 5],
      pngBytes[pos + 6],
      pngBytes[pos + 7]
    );

    if (chunkType === 'IDAT') {
      // Insert pHYs chunk before IDAT
      const result = new Uint8Array(pngBytes.length + physChunk.length);
      result.set(pngBytes.slice(0, pos), 0);
      result.set(physChunk, pos);
      result.set(pngBytes.slice(pos), pos + physChunk.length);
      return result;
    }

    // Move to next chunk
    pos += 4 + 4 + chunkLen + 4;
  }

  // If no IDAT found, return original
  return pngBytes;
}

function crc32(data) {
  const table = makeCRCTable();
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeCRCTable() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[i] = c;
  }
  return table;
}

export function downloadPNG(canvas, filename, dpi = 96) {
  const dataURL = canvas.toDataURL('image/png');
  const base64 = dataURL.split(',')[1];

  // Decode base64 to bytes
  const binaryString = atob(base64);
  const pngBytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    pngBytes[i] = binaryString.charCodeAt(i);
  }

  // Inject pHYs chunk
  const withPhys = injectPHYsChunk(pngBytes, dpi);

  // Create blob and download
  const blob = new Blob([withPhys], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPDF(canvas, filename, physicalWidthMm, physicalHeightMm) {
  const orientation = physicalWidthMm >= physicalHeightMm ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [physicalWidthMm, physicalHeightMm],
  });

  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, physicalWidthMm, physicalHeightMm);
  pdf.save(filename);
}

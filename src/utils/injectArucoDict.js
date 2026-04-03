/**
 * Injects our embedded ArUco dictionary data into js-aruco2's AR.DICTIONARIES
 * so the live detector can use all the same dictionaries as the generator.
 *
 * js-aruco2 natively only ships ARUCO and ARUCO_MIP_36h12. This bridges them.
 *
 * Format required by AR.Dictionary._initialize:
 *   codeList[i]: number  → _hex2bin(n, nBits) = n.toString(2).padStart(nBits,'0')
 *   nBits: inner grid area (gridN²)
 *   tau: accept detections with hammingDistance < tau (2 = allow 1-bit errors)
 *
 * The bit ordering produced by the detector (bits[row][col], row-major, 1=white)
 * joined as a string matches exactly what we get from reducing our flat bit
 * arrays with b0 as the MSB of the integer.
 */

import { AR } from 'js-aruco2';
import { ARUCO_DICTS } from '../data/aruco_dicts.js';

let injected = false;

export function injectDictsIfNeeded() {
  if (injected) return;
  injected = true;

  for (const [name, dict] of Object.entries(ARUCO_DICTS)) {
    if (AR.DICTIONARIES[name]) continue; // already present (shouldn't happen)
    const nBits = dict.gridN * dict.gridN;
    AR.DICTIONARIES[name] = {
      nBits,
      tau: 2, // accept hamming distance 0 or 1 — enough for reliable detection
      codeList: dict.data.map((bits) =>
        bits.reduce((n, b, i) => n | (b << (nBits - 1 - i)), 0)
      ),
    };
  }
}

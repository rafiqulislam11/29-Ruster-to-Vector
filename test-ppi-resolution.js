/**
 * Dedicated 300 PPI Print Resolution & Metadata Test Suite
 */
const assert = require('assert');

// Ported PpiWriter logic for NodeJS verification
class PpiWriterTest {
  static embedPngPpi(pngBytes, ppi = 300) {
    const ppm = Math.round(ppi / 0.0254); // Pixels per meter (11811 for 300 PPI)

    if (pngBytes[0] !== 0x89 || pngBytes[1] !== 0x50 || pngBytes[2] !== 0x4E || pngBytes[3] !== 0x47) {
      return pngBytes;
    }

    const ihdrLen = (pngBytes[8] << 24) | (pngBytes[9] << 16) | (pngBytes[10] << 8) | pngBytes[11];
    const insertPos = 8 + 4 + 4 + ihdrLen + 4;

    const physChunk = new Uint8Array(4 + 4 + 9 + 4);
    const view = new DataView(physChunk.buffer);

    view.setUint32(0, 9);
    physChunk[4] = 0x70; // p
    physChunk[5] = 0x48; // H
    physChunk[6] = 0x59; // Y
    physChunk[7] = 0x73; // s

    view.setUint32(8, ppm);
    view.setUint32(12, ppm);
    physChunk[16] = 1; // 1 = meter

    const crc = this.crc32(physChunk.subarray(4, 17));
    view.setUint32(17, crc);

    const result = new Uint8Array(pngBytes.length + physChunk.length);
    result.set(pngBytes.subarray(0, insertPos), 0);
    result.set(physChunk, insertPos);
    result.set(pngBytes.subarray(insertPos), insertPos + physChunk.length);
    return result;
  }

  static embedJpegPpi(jpegBytes, ppi = 300) {
    if (jpegBytes[0] !== 0xFF || jpegBytes[1] !== 0xD8) {
      return jpegBytes;
    }

    if (jpegBytes[2] === 0xFF && jpegBytes[3] === 0xE0) {
      if (jpegBytes[6] === 0x4A && jpegBytes[7] === 0x46 && jpegBytes[8] === 0x49 && jpegBytes[9] === 0x46 && jpegBytes[10] === 0x00) {
        jpegBytes[13] = 1;
        jpegBytes[14] = (ppi >> 8) & 0xFF;
        jpegBytes[15] = ppi & 0xFF;
        jpegBytes[16] = (ppi >> 8) & 0xFF;
        jpegBytes[17] = ppi & 0xFF;
        return jpegBytes;
      }
    }

    const jfifSegment = new Uint8Array([
      0xFF, 0xE0,
      0x00, 0x10,
      0x4A, 0x46, 0x49, 0x46, 0x00,
      0x01, 0x01,
      0x01,
      (ppi >> 8) & 0xFF, ppi & 0xFF,
      (ppi >> 8) & 0xFF, ppi & 0xFF,
      0x00, 0x00
    ]);

    const result = new Uint8Array(jpegBytes.length + jfifSegment.length);
    result.set(jpegBytes.subarray(0, 2), 0);
    result.set(jfifSegment, 2);
    result.set(jpegBytes.subarray(2), 2 + jfifSegment.length);
    return result;
  }

  static crcTable = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    return table;
  })();

  static crc32(buf) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ this.crcTable[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
}

function runTests() {
  console.log('=== VERIFYING 300 PPI PRINT METADATA ENCODER ===\n');

  // 1. Create minimal valid PNG buffer (Signature + IHDR + IEND)
  const dummyPng = new Uint8Array([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG Header
    // IHDR chunk (13 bytes data)
    0x00, 0x00, 0x00, 0x0D, // Length = 13
    0x49, 0x48, 0x44, 0x52, // 'IHDR'
    0x00, 0x00, 0x04, 0xB0, // Width = 1200
    0x00, 0x00, 0x03, 0x20, // Height = 800
    0x08, 0x06, 0x00, 0x00, 0x00, // Bit depth, color type, compression, filter, interlace
    0x67, 0x55, 0x24, 0x76, // CRC
    // IEND chunk
    0x00, 0x00, 0x00, 0x00,
    0x49, 0x45, 0x4E, 0x44,
    0xAE, 0x42, 0x60, 0x82
  ]);

  const png300 = PpiWriterTest.embedPngPpi(dummyPng, 300);

  // Validate PNG 300 PPI pHYs chunk
  assert(png300[0] === 0x89 && png300[1] === 0x50, 'PNG signature preserved');
  const physIndex = 33; // Right after IHDR
  const physLen = (png300[physIndex] << 24) | (png300[physIndex + 1] << 16) | (png300[physIndex + 2] << 8) | png300[physIndex + 3];
  assert.strictEqual(physLen, 9, 'pHYs chunk data length must be 9 bytes');

  const chunkType = String.fromCharCode(png300[physIndex + 4], png300[physIndex + 5], png300[physIndex + 6], png300[physIndex + 7]);
  assert.strictEqual(chunkType, 'pHYs', 'Chunk signature must be pHYs');

  const ppmX = (png300[physIndex + 8] << 24) | (png300[physIndex + 9] << 16) | (png300[physIndex + 10] << 8) | png300[physIndex + 11];
  const ppmY = (png300[physIndex + 12] << 24) | (png300[physIndex + 13] << 16) | (png300[physIndex + 14] << 8) | png300[physIndex + 15];
  const unit = png300[physIndex + 16];

  assert.strictEqual(ppmX, 11811, '300 PPI X density must equal 11811 pixels per meter');
  assert.strictEqual(ppmY, 11811, '300 PPI Y density must equal 11811 pixels per meter');
  assert.strictEqual(unit, 1, 'Density unit must be 1 (meter specifier for standard print calibration)');

  console.log('✓ PNG 300 PPI Metadata Injection: PASS (11811 pixels/meter pHYs chunk)');

  // 2. Validate JPEG 300 DPI APP0 marker
  const dummyJpg = new Uint8Array([
    0xFF, 0xD8, // SOI
    0xFF, 0xE0, // APP0
    0x00, 0x10, // Length = 16
    0x4A, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
    0x01, 0x01, // Version 1.1
    0x00, // Unit: None (72 DPI default)
    0x00, 0x48, // X: 72
    0x00, 0x48, // Y: 72
    0x00, 0x00,
    0xFF, 0xD9 // EOI
  ]);

  const jpg300 = PpiWriterTest.embedJpegPpi(dummyJpg, 300);
  assert.strictEqual(jpg300[13], 1, 'JPEG density unit must be 1 (dots per inch)');
  const jpgXDensity = (jpg300[14] << 8) | jpg300[15];
  const jpgYDensity = (jpg300[16] << 8) | jpg300[17];
  assert.strictEqual(jpgXDensity, 300, 'JPEG X density must be 300 DPI');
  assert.strictEqual(jpgYDensity, 300, 'JPEG Y density must be 300 DPI');

  console.log('✓ JPEG 300 DPI Metadata Injection: PASS (0x012C density in JFIF APP0 segment)');

  // 3. Physical Print Dimension Calculations
  const calcPrint = (w, h, ppi = 300) => ({
    inchesW: (w / ppi).toFixed(1),
    inchesH: (h / ppi).toFixed(1),
    cmW: ((w / ppi) * 2.54).toFixed(1),
    cmH: ((h / ppi) * 2.54).toFixed(1)
  });

  const printMaster = calcPrint(4500, 3000, 300);
  assert.strictEqual(printMaster.inchesW, '15.0');
  assert.strictEqual(printMaster.inchesH, '10.0');
  assert.strictEqual(printMaster.cmW, '38.1');
  assert.strictEqual(printMaster.cmH, '25.4');
  console.log(`✓ 300 PPI Print Master Dimension: 4500×3000 px → ${printMaster.inchesW}" × ${printMaster.inchesH}" (${printMaster.cmW} × ${printMaster.cmH} cm)`);

  const print4k = calcPrint(3840, 2160, 300);
  console.log(`✓ 4K Ultra HD @ 300 PPI Dimension: 3840×2160 px → ${print4k.inchesW}" × ${print4k.inchesH}" (${print4k.cmW} × ${print4k.cmH} cm)`);

  console.log('\n=== ALL 300 PPI VALIDATION TESTS PASSED ===');
}

runTests();

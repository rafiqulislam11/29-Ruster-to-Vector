/**
 * CreativeForge AI — 300 PPI High-Resolution Metadata Encoder
 * Injects authentic 300 DPI/PPI print metadata into PNG (pHYs chunk)
 * and JPEG (JFIF APP0 segment) so Adobe Photoshop, Illustrator, InDesign,
 * and print systems recognize the file as high-resolution 300 PPI.
 */

export class PpiWriter {
  /**
   * Embed 300 PPI metadata into a canvas export
   * @param {HTMLCanvasElement} canvas
   * @param {string} format 'png' | 'jpg' | 'jpeg'
   * @param {number} ppi Target PPI (default 300)
   * @param {number} quality JPEG quality (0 to 1)
   * @returns {Promise<Blob>}
   */
  static async exportWithPpi(canvas, format = 'png', ppi = 300, quality = 0.95) {
    const mime = (format === 'jpg' || format === 'jpeg') ? 'image/jpeg' : 'image/png';
    const blob = await new Promise(resolve => canvas.toBlob(resolve, mime, quality));
    const buffer = await blob.arrayBuffer();

    if (mime === 'image/png') {
      const ppiBytes = this.embedPngPpi(new Uint8Array(buffer), ppi);
      return new Blob([ppiBytes], { type: 'image/png' });
    } else {
      const ppiBytes = this.embedJpegPpi(new Uint8Array(buffer), ppi);
      return new Blob([ppiBytes], { type: 'image/jpeg' });
    }
  }

  /**
   * Injects pHYs chunk into PNG binary
   * 300 PPI = 300 / 0.0254 meters = ~11811 pixels/meter
   */
  static embedPngPpi(pngBytes, ppi = 300) {
    const ppm = Math.round(ppi / 0.0254); // Pixels per meter

    // PNG Signature: 8 bytes
    // Check if valid PNG
    if (pngBytes[0] !== 0x89 || pngBytes[1] !== 0x50 || pngBytes[2] !== 0x4E || pngBytes[3] !== 0x47) {
      return pngBytes;
    }

    // Find end of IHDR chunk (starts at byte 8, length is usually 13 + 12 chunk overhead = 25 bytes total -> byte 33)
    const ihdrLen = (pngBytes[8] << 24) | (pngBytes[9] << 16) | (pngBytes[10] << 8) | pngBytes[11];
    const insertPos = 8 + 4 + 4 + ihdrLen + 4; // Right after IHDR chunk

    // Build pHYs Chunk:
    // Length: 9 bytes
    // Type: 'pHYs' (0x70 0x48 0x59 0x73)
    // Data:
    //   4 bytes: X pixels per unit (ppm)
    //   4 bytes: Y pixels per unit (ppm)
    //   1 byte: unit specifier (1 = meter)
    // CRC: 4 bytes
    const physChunk = new Uint8Array(4 + 4 + 9 + 4);
    const view = new DataView(physChunk.buffer);

    // Length
    view.setUint32(0, 9);
    // Type 'pHYs'
    physChunk[4] = 0x70; // p
    physChunk[5] = 0x48; // H
    physChunk[6] = 0x59; // Y
    physChunk[7] = 0x73; // s

    // Data
    view.setUint32(8, ppm);
    view.setUint32(12, ppm);
    physChunk[16] = 1; // Meter unit

    // Compute CRC32 for chunk type and data (bytes 4 to 16 inclusive = 13 bytes)
    const crc = this.crc32(physChunk.subarray(4, 17));
    view.setUint32(17, crc);

    // Check if a pHYs chunk already exists in PNG, skip duplicate
    for (let i = insertPos; i < pngBytes.length - 8; i++) {
      if (pngBytes[i] === 0x70 && pngBytes[i + 1] === 0x48 && pngBytes[i + 2] === 0x59 && pngBytes[i + 3] === 0x73) {
        // Replace existing pHYs chunk data
        const start = i - 4;
        const totalChunkLen = 4 + 4 + 9 + 4;
        pngBytes.set(physChunk, start);
        return pngBytes;
      }
    }

    // Create new buffer with inserted pHYs chunk
    const result = new Uint8Array(pngBytes.length + physChunk.length);
    result.set(pngBytes.subarray(0, insertPos), 0);
    result.set(physChunk, insertPos);
    result.set(pngBytes.subarray(insertPos), insertPos + physChunk.length);
    return result;
  }

  /**
   * Injects JFIF APP0 marker with 300 DPI density into JPEG binary
   */
  static embedJpegPpi(jpegBytes, ppi = 300) {
    // SOI marker: FF D8
    if (jpegBytes[0] !== 0xFF || jpegBytes[1] !== 0xD8) {
      return jpegBytes;
    }

    // Check if APP0 marker exists at byte 2
    if (jpegBytes[2] === 0xFF && jpegBytes[3] === 0xE0) {
      // Check for "JFIF\0"
      if (jpegBytes[6] === 0x4A && jpegBytes[7] === 0x46 && jpegBytes[8] === 0x49 && jpegBytes[9] === 0x46 && jpegBytes[10] === 0x00) {
        // Density units at byte 13: 1 = dots per inch
        jpegBytes[13] = 1;
        // Xdensity at bytes 14-15
        jpegBytes[14] = (ppi >> 8) & 0xFF;
        jpegBytes[15] = ppi & 0xFF;
        // Ydensity at bytes 16-17
        jpegBytes[16] = (ppi >> 8) & 0xFF;
        jpegBytes[17] = ppi & 0xFF;
        return jpegBytes;
      }
    }

    // If no JFIF header, construct a standard JFIF APP0 segment
    const jfifSegment = new Uint8Array([
      0xFF, 0xE0, // APP0
      0x00, 0x10, // Length = 16 bytes
      0x4A, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
      0x01, 0x01, // Version 1.1
      0x01, // Units: 1 = dots per inch (DPI/PPI)
      (ppi >> 8) & 0xFF, ppi & 0xFF, // Xdensity
      (ppi >> 8) & 0xFF, ppi & 0xFF, // Ydensity
      0x00, 0x00 // Thumbnail X & Y
    ]);

    const result = new Uint8Array(jpegBytes.length + jfifSegment.length);
    result.set(jpegBytes.subarray(0, 2), 0); // FF D8
    result.set(jfifSegment, 2);
    result.set(jpegBytes.subarray(2), 2 + jfifSegment.length);
    return result;
  }

  // Standard CRC32 table & calculator
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
    let c = 0xFFFFFFFF;
    const table = PpiWriter.crcTable;
    for (let i = 0; i < buf.length; i++) {
      c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
}

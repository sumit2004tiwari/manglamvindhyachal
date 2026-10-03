import { BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import { validateImage } from './upload-validation.js';

export async function optimizeUpload(value: string, kind: 'photo' | 'document') {
  const label = kind === 'photo' ? 'Profile photo' : 'Identity document';
  validateImage(value, label);
  const bytes = Buffer.from(value.slice(value.indexOf(',') + 1), 'base64');
  if (bytes.length <= 128 * 1024) return value;
  try {
    // Decode/resize before the transaction. Documents retain a larger resolution
    // and higher quality for readable text; never upscale or enlarge an upload.
    const size = kind === 'photo' ? 800 : 2000;
    const optimized = await sharp(bytes, { limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: kind === 'photo' ? 82 : 92 })
      .toBuffer();
    const result = `data:image/webp;base64,${optimized.toString('base64')}`;
    return result.length < value.length ? result : value;
  } catch {
    throw new BadRequestException(`${label} could not be decoded. Choose another image.`);
  }
}

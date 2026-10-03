import { BadRequestException } from '@nestjs/common';

// Store uploads durably in Postgres; never publish identity documents in public DTOs.
export function validateImage(value: string, label: string) {
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value || '');
  if (!match) throw new BadRequestException(`${label} must be a JPEG, PNG or WebP image.`);
  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.length > 2 * 1024 * 1024) throw new BadRequestException(`${label} must be at most 2 MB.`);
  const valid = match[1] === 'jpeg' ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    : match[1] === 'png' ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  if (!valid) throw new BadRequestException(`${label} contains invalid image data.`);
}

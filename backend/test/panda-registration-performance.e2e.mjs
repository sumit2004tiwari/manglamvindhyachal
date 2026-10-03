import 'dotenv/config';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';

if (!process.env.TEST_DATABASE_URL || !process.env.TEST_BRANCH_ID) {
  throw new Error('Set TEST_DATABASE_URL and TEST_BRANCH_ID to an isolated migrated test branch.');
}
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const { PrismaService } = await import('../dist/prisma.service.js');
const { PandasService } = await import('../dist/pandas/pandas.service.js');

test('registration batches specialities with realistic image payloads and preserves updates', async () => {
  const db = new PrismaService();
  const service = new PandasService(db);
  let user;
  try {
    const phone = String(9000000000 + Math.floor(Math.random() * 800000000));
    user = await db.user.create({ data: { phone } });
    const png = await sharp({ create: { width: 1800, height: 1200, channels: 3, background: '#ffffff' } })
      .composite([{ input: Buffer.from('<svg width="1800" height="1200"><text x="100" y="200" font-size="72">Identity document 1234</text></svg>') }])
      .png().toBuffer();
    const image = `data:image/png;base64,${Buffer.concat([
      png,
      // PNG permits trailing bytes; model a large upload without external fixtures.
      Buffer.alloc(256 * 1024),
    ]).toString('base64')}`;
    const titles = Array.from({ length: 12 }, (_, i) => `Performance test Pooja ${i}`);
    const data = { name: 'Registration test', phone, bio: 'Test profile', photoUrl: image,
      identityDocument: image, experience: 0, languages: ['Hindi'], specialities: [...titles, titles[0]],
      dateOfBirth: '1990-01-01', address: 'Test address', identityType: 'AADHAAR', identityLastFour: '1234' };
    const start = performance.now();
    const panda = await service.create(user.id, data);
    console.log(`Registration: ${Math.round(performance.now() - start)} ms; 12 specialities; two 256 KB images`);
    assert.ok(panda.vendorId);
    assert.ok(panda.photoUrl.startsWith('data:image/webp;base64,'));
    assert.ok(panda.photoUrl.length < image.length);
    const photoMetadata = await sharp(Buffer.from(panda.photoUrl.split(',')[1], 'base64')).metadata();
    assert.equal(photoMetadata.width, 800);
    assert.equal(panda.experience, 0);
    assert.equal(await db.listing.count({ where: { vendorId: panda.vendorId } }), 12);
    const vendor = await db.vendorProfile.findUnique({ where: { id: panda.vendorId } });
    const docMetadata = await sharp(Buffer.from(vendor.aadhaarDocUrl.split(',')[1], 'base64')).metadata();
    assert.equal(docMetadata.width, 1800);
    assert.equal(docMetadata.height, 1200);
    assert.ok(vendor.aadhaarDocUrl.length < image.length);
    assert.equal(vendor.verificationStatus, 'PENDING');
    await assert.rejects(service.create(user.id, data), /already registered/);
    await assert.rejects(service.create(user.id, { ...data, phone: '9000000000' }, true), /verified during login/);
    const updateStart = performance.now();
    const updated = await service.create(user.id, { ...data, specialities: [...titles, 'New Pooja'], experience: 1 }, true);
    console.log(`Profile update: ${Math.round(performance.now() - updateStart)} ms`);
    assert.equal(updated.id, panda.id);
    assert.equal(await db.listing.count({ where: { vendorId: panda.vendorId } }), 13);
    assert.equal(await db.panda.count({ where: { phone } }), 1);
  } finally {
    if (user) {
      const vendor = await db.vendorProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
      if (vendor) {
        await db.panda.deleteMany({ where: { vendorId: vendor.id } });
        await db.listing.deleteMany({ where: { vendorId: vendor.id } });
        await db.vendorProfile.delete({ where: { id: vendor.id } });
      }
      await db.user.delete({ where: { id: user.id } });
    }
    await db.onModuleDestroy();
  }
});

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

// Explicit isolated database only. Never default to the application's production URL.
if (!process.env.TEST_DATABASE_URL || !process.env.TEST_BRANCH_ID) throw new Error('Set TEST_DATABASE_URL and TEST_BRANCH_ID to an isolated, migrated Neon test branch.');
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const { PrismaService } = await import('../dist/prisma.service.js');
const db = new PrismaService();
const port = 3013;
const base = `http://localhost:${port}/api`;
let server;
let serverOutput = '';
const users = [];
const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=';
const phoneBase = 9000000000 + Math.floor(Math.random() * 800000000);
const scheduledDate = `${new Date().getUTCFullYear() + 1}-10-10T11:00:00+05:30`;

async function api(path, token, body, method = body ? 'POST' : 'GET') {
  const res = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }, ...(body && { body: JSON.stringify(body) }), signal: AbortSignal.timeout(60000) });
  if (res.status >= 500) console.error(serverOutput.slice(-4000));
  return { status: res.status, data: await res.json() };
}
async function login(phone, role = 'USER') {
  assert.equal((await api('/auth/otp/request', null, { phone })).status, 201);
  const result = await api('/auth/otp/verify', null, { phone, otp: '123456', role });
  assert.equal(result.status, 201, JSON.stringify(result.data));
  if (!users.includes(result.data.user.id)) users.push(result.data.user.id);
  return result.data;
}
function registration(phone, name) {
  return { name, phone, bio: 'Experienced Panda for Pooja programmes.', photoUrl: image, experience: 0,
    languages: ['Hindi'], specialities: ['Mundan Pooja'], dateOfBirth: '1990-01-01', address: 'Test address in Vindhyachal', identityType: 'AADHAAR', identityLastFour: '1234', identityDocument: image };
}

before(async () => {
  server = spawn(process.execPath, ['dist/main.js'], { cwd: new URL('../', import.meta.url), env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  server.stdout.on('data', b => { serverOutput += b; });
  server.stderr.on('data', b => { serverOutput += b; });
  for (let i = 0; i < 90; i++) {
    try { const r = await fetch(base, { signal: AbortSignal.timeout(1000) }); if (r.ok) return; } catch {}
    if (server.exitCode != null) throw new Error(`Test server stopped: ${serverOutput.slice(-3000)}`);
    await delay(500);
  }
  throw new Error('Test server did not start.');
});

after(async () => {
  server?.kill();
  // Remove only the randomly created fixture accounts and their dependencies.
  if (users.length) {
    const vendorIds = (await db.vendorProfile.findMany({ where: { userId: { in: users } }, select: { id: true } })).map(v => v.id);
    const bookingIds = (await db.booking.findMany({ where: { OR: [{ userId: { in: users } }, { vendorId: { in: vendorIds } }] }, select: { id: true } })).map(b => b.id);
    await db.message.deleteMany({ where: { bookingId: { in: bookingIds } } });
    await db.review.deleteMany({ where: { bookingId: { in: bookingIds } } });
    await db.payment.deleteMany({ where: { bookingId: { in: bookingIds } } });
    await db.booking.deleteMany({ where: { id: { in: bookingIds } } });
    await db.panda.deleteMany({ where: { vendorId: { in: vendorIds } } });
    await db.listing.deleteMany({ where: { vendorId: { in: vendorIds } } });
    await db.availabilitySlot.deleteMany({ where: { vendorId: { in: vendorIds } } });
    await db.vendorProfile.deleteMany({ where: { id: { in: vendorIds } } });
    await db.user.deleteMany({ where: { id: { in: users } } });
  }
  await db.onModuleDestroy();
});

test('Panda registration, KYC, booking, persistence and access control', async t => {
  const panda = await login(String(phoneBase));
  const other = await login(String(phoneBase + 1));
  const customer = await login(String(phoneBase + 2));
  let profile, secondProfile, booking;
  await t.test('requires login and validates KYC and image uploads', async () => {
    assert.equal((await api('/pandas', null, registration(panda.user.phone, 'Test Panda'))).status, 401);
    assert.equal((await api('/pandas', panda.accessToken, { ...registration(panda.user.phone, 'Test Panda'), identityDocument: 'invalid' })).status, 400);
    assert.equal((await api('/pandas', panda.accessToken, { ...registration(panda.user.phone, 'Test Panda'), identityDocument: undefined })).status, 400);
    assert.equal((await api('/pandas', panda.accessToken, registration(other.user.phone, 'Test Panda'))).status, 403);
  });
  await t.test('saves profile, KYC and zero years experience atomically', async () => {
    const result = await api('/pandas', panda.accessToken, registration(panda.user.phone, 'Test Panda'));
    assert.equal(result.status, 201, JSON.stringify(result.data)); profile = result.data;
    assert.ok(profile.vendorId); assert.equal(profile.experience, 0);
    const saved = await db.vendorProfile.findUnique({ where: { id: profile.vendorId } });
    assert.equal(saved.aadhaarDocUrl, image); assert.equal(saved.photoUrl, image); assert.equal(saved.address, 'Test address in Vindhyachal');
    assert.equal(saved.verificationStatus, 'PENDING');
    secondProfile = (await api('/pandas', other.accessToken, registration(other.user.phone, 'Other Panda'))).data;
  });
  await t.test('public listing/profile includes photo and Pooja but excludes KYC', async () => {
    assert.ok((await api('/pandas')).data.some(p => p.id === profile.id && p.photoUrl === image));
    const detail = (await api(`/pandas/${profile.id}`)).data;
    assert.equal(detail.vendor.listings[0].title, 'Mundan Pooja');
    for (const path of [`/pandas/${profile.id}`, `/vendors/${profile.vendorId}`, `/listings/${detail.vendor.listings[0].id}`]) {
      const text = JSON.stringify((await api(path)).data);
      for (const key of ['aadhaarDocUrl', 'identityDocument', 'bankAccountDetails', 'dateOfBirth', 'identityLastFour', 'address']) assert.ok(!text.includes(`"${key}"`), `${path} leaked ${key}`);
    }
  });
  await t.test('existing JWT sees Panda role and dashboard profile immediately', async () => {
    const me = await api('/auth/me', panda.accessToken);
    assert.equal(me.data.role, 'VENDOR'); assert.equal(me.data.hasKyc, true);
    assert.equal((await api('/vendors/me/profile', panda.accessToken)).data.id, profile.vendorId);
    assert.equal((await api('/pandas', panda.accessToken, registration(panda.user.phone, 'Test Panda'))).status, 409);
  });
  const listing = (await api(`/pandas/${profile.id}`)).data.vendor.listings[0];
  const payload = { vendorId: profile.vendorId, listingId: listing.id, scheduledDate, groupSize: 3, customerName: 'Test Customer', customerPhone: customer.user.phone, location: 'Vindhyachal Temple', notes: 'Mundan for our child', performedOnBehalfOf: 'Child' };
  await t.test('rejects wrong Panda, missing time, past date and invalid group size', async () => {
    assert.equal((await api('/bookings', customer.accessToken, { ...payload, vendorId: secondProfile.vendorId })).status, 400);
    assert.equal((await api('/bookings', customer.accessToken, { ...payload, scheduledDate: '2027-10-10' })).status, 400);
    assert.equal((await api('/bookings', customer.accessToken, { ...payload, scheduledDate: '2020-10-10T11:00:00+05:30' })).status, 400);
    assert.equal((await api('/bookings', customer.accessToken, { ...payload, groupSize: 0 })).status, 400);
    assert.equal((await api('/bookings', panda.accessToken, payload)).status, 400);
  });
  await t.test('simultaneous bookings create exactly one booking and one conflict', async () => {
    const results = await Promise.all([api('/bookings', customer.accessToken, payload), api('/bookings', customer.accessToken, payload)]);
    assert.deepEqual(results.map(r => r.status).sort(), [201, 409], JSON.stringify(results));
    booking = results.find(r => r.status === 201).data;
    const saved = await db.booking.findUnique({ where: { id: booking.id } });
    assert.equal(saved.vendorId, profile.vendorId); assert.equal(saved.customerName, 'Test Customer');
    assert.equal(saved.scheduledDate.toISOString(), new Date(scheduledDate).toISOString());
  });
  await t.test('Panda dashboard shows own booking and excludes another Panda', async () => {
    const own = (await api(`/users/${panda.user.id}/bookings?as=panda`, panda.accessToken)).data;
    assert.equal(own.length, 1); assert.equal(own[0].listing.title, 'Mundan Pooja'); assert.equal(own[0].customerPhone, customer.user.phone);
    assert.equal((await api(`/users/${other.user.id}/bookings?as=panda`, other.accessToken)).data.length, 0);
    assert.equal((await api(`/users/${panda.user.id}/bookings?as=panda`, other.accessToken)).status, 403);
    assert.equal((await api(`/bookings/${booking.id}`, other.accessToken)).status, 403);
  });
  await t.test('bookings survive repeat reads and fresh customer/Panda login', async () => {
    const freshCustomer = await login(customer.user.phone);
    const freshPanda = await login(panda.user.phone, 'USER');
    assert.equal(freshPanda.user.role, 'VENDOR'); assert.equal(freshPanda.user.hasKyc, true);
    assert.ok((await api(`/users/${customer.user.id}/bookings`, freshCustomer.accessToken)).data.some(b => b.id === booking.id));
    assert.ok((await api(`/users/${panda.user.id}/bookings?as=panda`, freshPanda.accessToken)).data.some(b => b.id === booking.id));
    assert.equal((await api(`/users/${panda.user.id}/bookings`, freshPanda.accessToken)).data.length, 0);
  });
  await t.test('only booking owner Panda can accept; invalid transitions are rejected', async () => {
    assert.equal((await api(`/bookings/${booking.id}/status`, other.accessToken, { status: 'CONFIRMED' }, 'PATCH')).status, 403);
    assert.equal((await api(`/bookings/${booking.id}/status`, panda.accessToken, { status: 'NONSENSE' }, 'PATCH')).status, 400);
    assert.equal((await api(`/bookings/${booking.id}/status`, panda.accessToken, { status: 'CONFIRMED' }, 'PATCH')).status, 200);
    assert.equal((await api(`/bookings/${booking.id}/status`, panda.accessToken, { status: 'COMPLETED' }, 'PATCH')).status, 400);
  });
  await t.test('customer cancellation releases the date/time for a new booking', async () => {
    assert.equal((await api(`/bookings/${booking.id}/cancel`, other.accessToken, {})).status, 403);
    assert.equal((await api(`/bookings/${booking.id}/cancel`, customer.accessToken, {})).status, 201);
    const result = await api('/bookings', customer.accessToken, payload);
    assert.equal(result.status, 201); booking = result.data;
  });
  await t.test('admin APIs and admin self-registration are protected', async () => {
    assert.equal((await api('/admin/vendors/pending', customer.accessToken)).status, 403);
    assert.equal((await api('/auth/otp/verify', null, { phone: customer.user.phone, otp: '123456', role: 'ADMIN' })).status, 400);
  });
  await t.test('existing profiles can update KYC without duplicating Panda accounts', async () => {
    const result = await api('/pandas/me', panda.accessToken, { ...registration(panda.user.phone, 'Updated Test Panda'), experience: 1 }, 'PATCH');
    assert.equal(result.status, 200, JSON.stringify(result.data)); assert.equal(result.data.id, profile.id);
    assert.equal((await api(`/pandas/${profile.id}`)).data.name, 'Updated Test Panda');
    assert.equal(await db.panda.count({ where: { phone: panda.user.phone } }), 1);
  });
  let paidListing;
  await t.test('Pooja listings reject forged ownership and preserve Panda association', async () => {
    const listingData = { title: 'Fixed price Pooja', description: 'Test Pooja service', category: 'Pooja', price: 1200, priceType: 'FIXED', maxGroupSize: 4 };
    assert.equal((await api('/listings', panda.accessToken, { ...listingData, vendorId: secondProfile.vendorId })).status, 400);
    const result = await api('/listings', panda.accessToken, listingData); assert.equal(result.status, 201, JSON.stringify(result.data)); paidListing = result.data;
    assert.equal(paidListing.vendorId, profile.vendorId);
    assert.equal((await api(`/listings/${paidListing.id}`, other.accessToken, { price: 1 }, 'PATCH')).status, 403);
    assert.equal((await api(`/listings/${paidListing.id}`, panda.accessToken, { status: 'PAUSED' }, 'PATCH')).status, 200);
    assert.equal((await api('/bookings', customer.accessToken, { ...payload, listingId: paidListing.id, scheduledDate: scheduledDate.replace('11:00', '14:00') })).status, 400);
    assert.equal((await api(`/listings/${paidListing.id}`, panda.accessToken, { status: 'ACTIVE' }, 'PATCH')).status, 200);
  });
  await t.test('demo payment is owner-only, requires confirmation, and is idempotent', async () => {
    const result = await api('/bookings', customer.accessToken, { ...payload, listingId: paidListing.id, scheduledDate: scheduledDate.replace('11:00', '14:00') });
    assert.equal(result.status, 201); const id = result.data.id;
    assert.equal((await api('/payments/create-order', other.accessToken, { bookingId: id })).status, 403);
    assert.equal((await api('/payments/create-order', customer.accessToken, { bookingId: id })).status, 400);
    assert.equal((await api(`/bookings/${id}/status`, panda.accessToken, { status: 'CONFIRMED' }, 'PATCH')).status, 200);
    const payments = await Promise.all([api('/payments/create-order', customer.accessToken, { bookingId: id }), api('/payments/create-order', customer.accessToken, { bookingId: id })]);
    assert.ok(payments.every(r => r.status === 201), JSON.stringify(payments));
    assert.equal(await db.payment.count({ where: { bookingId: id } }), 1);
    assert.equal((await api('/payments/webhook', null, {})).status, 503);
  });
  await t.test('slot ownership, time matching, claim and cancellation release work', async () => {
    const date = scheduledDate.slice(0, 10);
    const slots = { slots: [{ date, startTime: '16:00', endTime: '17:00' }] };
    assert.equal((await api(`/vendors/${secondProfile.vendorId}/availability`, panda.accessToken, slots)).status, 403);
    assert.equal((await api(`/vendors/${profile.vendorId}/availability`, panda.accessToken, slots)).status, 201);
    const slot = (await api(`/vendors/${profile.vendorId}/availability?date=${date}`)).data[0];
    assert.ok(slot);
    assert.equal((await api('/bookings', customer.accessToken, { ...payload, slotId: slot.id, scheduledDate: scheduledDate.replace('11:00', '15:00') })).status, 400);
    const result = await api('/bookings', customer.accessToken, { ...payload, slotId: slot.id, scheduledDate: scheduledDate.replace('11:00', '16:00') });
    assert.equal(result.status, 201, JSON.stringify(result.data));
    assert.equal((await db.availabilitySlot.findUnique({ where: { id: slot.id } })).isBooked, true);
    await api(`/bookings/${result.data.id}/cancel`, customer.accessToken, {});
    assert.equal((await db.availabilitySlot.findUnique({ where: { id: slot.id } })).isBooked, false);
    assert.equal((await api('/bookings', customer.accessToken, { ...payload, slotId: slot.id, scheduledDate: scheduledDate.replace('11:00', '16:00') })).status, 201);
  });
  await t.test('completed bookings support one customer review and update rating', async () => {
    assert.equal((await api(`/bookings/${booking.id}/status`, panda.accessToken, { status: 'CONFIRMED' }, 'PATCH')).status, 200);
    // Move only this isolated fixture into the past to exercise the completion flow.
    await db.booking.update({ where: { id: booking.id }, data: { scheduledDate: new Date(Math.floor(Date.now() / 60000) * 60000 - 3600000) } });
    assert.equal((await api(`/bookings/${booking.id}/status`, panda.accessToken, { status: 'COMPLETED' }, 'PATCH')).status, 200);
    assert.equal((await api('/reviews', customer.accessToken, { bookingId: booking.id, rating: 3.5 })).status, 400);
    assert.equal((await api('/reviews', other.accessToken, { bookingId: booking.id, rating: 5 })).status, 400);
    const review = await api('/reviews', customer.accessToken, { bookingId: booking.id, rating: 5, comment: 'Test review' }); assert.equal(review.status, 201);
    assert.equal((await api('/reviews', customer.accessToken, { bookingId: booking.id, rating: 5 })).status, 400);
    assert.equal((await db.vendorProfile.findUnique({ where: { id: profile.vendorId } })).avgRating, 5);
    assert.ok((await api(`/users/${customer.user.id}/bookings`, customer.accessToken)).data.find(b => b.id === booking.id).review.id);
  });
  await t.test('admin KYC review updates visibility without changing booking ownership', async () => {
    await db.user.update({ where: { id: other.user.id }, data: { role: 'ADMIN' } });
    const pending = await api('/admin/vendors/pending', other.accessToken); assert.equal(pending.status, 200);
    assert.equal(pending.data.find(v => v.id === profile.vendorId).aadhaarDocUrl, image);
    assert.equal((await api(`/admin/vendors/${profile.vendorId}/verify`, other.accessToken, { status: 'INVALID' }, 'PATCH')).status, 400);
    assert.equal((await api(`/admin/vendors/${profile.vendorId}/verify`, other.accessToken, { status: 'VERIFIED' }, 'PATCH')).status, 200);
    assert.ok((await api('/vendors?category=Pooja')).data.some(v => v.id === profile.vendorId));
    assert.equal((await api(`/admin/vendors/${profile.vendorId}/verify`, other.accessToken, { status: 'REJECTED' }, 'PATCH')).status, 200);
    assert.ok(!(await api('/pandas')).data.some(p => p.id === profile.id));
    assert.equal((await api(`/pandas/${profile.id}`)).status, 404);
    assert.ok((await api(`/users/${panda.user.id}/bookings?as=panda`, panda.accessToken)).data.every(b => b.vendorId === profile.vendorId));
  });
});

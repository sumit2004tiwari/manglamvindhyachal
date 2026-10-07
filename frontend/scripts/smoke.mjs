import assert from 'node:assert/strict';

const base = process.env.FRONTEND_URL || 'http://localhost:3000';
const api = process.env.API_URL || 'http://localhost:3001/api';
const directory = await fetch(`${api}/pandas`).then(r => { assert.ok(r.ok); return r.json(); });
const routes = ['/', '/pandas', '/pandas/register', '/auth/login', '/search', '/my-bookings', '/vendor/dashboard', '/vendor/listings', '/vendor/onboarding', '/admin'];
if (directory[0]) {
  routes.push(`/pandas/${directory[0].id}`);
  if (directory[0].vendorId) routes.push(`/vendors/${directory[0].vendorId}`);
}
const results = await Promise.all(routes.map(async path => {
  const r = await fetch(base + path);
  assert.equal(r.status, 200, `${path} failed`);
  if (path === '/vendor/onboarding') assert.ok(r.url.endsWith('/pandas/register'), 'Onboarding must redirect to Panda registration');
  return `${path}: ${r.status}`;
}));
const home = await fetch(base).then(r => r.text());
for (const anchor of ['darshan', 'puja-seva', 'maa-shringar', 'hotel', 'bhojan', 'vahan', 'parichay', 'sampark']) assert.ok(home.includes(`id="${anchor}"`), `Missing navbar anchor ${anchor}`);
assert.ok(home.includes('/pandas/register'), 'Homepage must link to registration');
const assets = [...new Set([...home.matchAll(/(?:src|href)="([^"<>]*\/_next\/static\/[^"<>]+)"/g)].map(m => m[1].replaceAll('&amp;', '&')))];
await Promise.all(assets.map(async path => { assert.equal((await fetch(new URL(path, base))).status, 200, `Asset ${path} failed`); }));
console.log(results.join('\n'));
console.log(`Navbar anchors and ${assets.length} JavaScript/CSS assets passed.`);
console.log('These are HTTP/render checks; interactive browser validation is separate.');

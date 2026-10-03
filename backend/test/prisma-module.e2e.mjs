import 'dotenv/config';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NestFactory } from '@nestjs/core';

if (!process.env.TEST_DATABASE_URL || !process.env.TEST_BRANCH_ID) {
  throw new Error('Set TEST_DATABASE_URL and TEST_BRANCH_ID to an isolated migrated test branch.');
}
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const { AppModule } = await import('../dist/app.module.js');
const { PrismaService } = await import('../dist/prisma.service.js');

test('all application modules resolve a single database pool and the API starts', async () => {
  const start = performance.now();
  const app = await NestFactory.create(AppModule, { logger: false });
  try {
    app.setGlobalPrefix('api');
    await app.listen(0, '127.0.0.1');
    console.log(`Backend startup with shared Prisma pool: ${Math.round(performance.now() - start)} ms`);
    const clients = app.get(PrismaService, { each: true });
    assert.equal(clients.length, 1, 'Feature modules must not provide their own PrismaService');
    const port = app.getHttpServer().address().port;
    const response = await fetch(`http://127.0.0.1:${port}/api/pandas`, { signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(await response.json()));
  } finally {
    await app.close();
  }
});

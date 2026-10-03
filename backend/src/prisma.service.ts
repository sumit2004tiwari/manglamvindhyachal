import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Socket } from 'node:net';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required. Configure it in backend/.env.');
    }
    const url = new URL(process.env.DATABASE_URL);
    // Preserve pg's current certificate verification without the SSL alias warning.
    if (!url.searchParams.has('uselibpqcompat') &&
        ['prefer', 'require', 'verify-ca'].includes(url.searchParams.get('sslmode') ?? '')) {
      url.searchParams.set('sslmode', 'verify-full');
    }
    const pool = new Pool({
      connectionString: url.toString(),
      max: 5,
      connectionTimeoutMillis: 15000,
      // Reuse connections between form submissions instead of repeating TLS setup.
      idleTimeoutMillis: 60000,
      keepAlive: true,
      // Automatic IPv4/IPv6 selection stalls on some Windows networks.
      // Keep hostname resolution and TLS server identity; never pin a Neon IP.
      ...(process.platform === 'win32' ? {
        stream: () => {
          const socket = new Socket();
          const connect = socket.connect.bind(socket);
          // pg invokes the port/host overload of Socket.connect.
          socket.connect = ((port: number, host: string) =>
            connect({ port, host, family: 4 })) as typeof socket.connect;
          return socket;
        },
      } : {}),
    });
    const adapter = new PrismaPg(pool);
    super({ adapter, transactionOptions: { maxWait: 15000, timeout: 30000 } });
    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      // The adapter's $connect creates a pool lazily; verify a real connection.
      await this.$queryRaw`SELECT 1`;
    } catch {
      await this.$disconnect();
      await this.pool.end();
      throw new Error('Database connection failed. Check DATABASE_URL, Neon compute status, and network access to PostgreSQL port 5432.');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}

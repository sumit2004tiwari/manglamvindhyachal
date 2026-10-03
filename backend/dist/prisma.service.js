var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Socket } from 'node:net';
let PrismaService = class PrismaService extends PrismaClient {
    pool;
    constructor() {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is required. Configure it in backend/.env.');
        }
        const url = new URL(process.env.DATABASE_URL);
        if (!url.searchParams.has('uselibpqcompat') &&
            ['prefer', 'require', 'verify-ca'].includes(url.searchParams.get('sslmode') ?? '')) {
            url.searchParams.set('sslmode', 'verify-full');
        }
        const pool = new Pool({
            connectionString: url.toString(),
            max: 5,
            connectionTimeoutMillis: 15000,
            idleTimeoutMillis: 60000,
            keepAlive: true,
            ...(process.platform === 'win32' ? {
                stream: () => {
                    const socket = new Socket();
                    const connect = socket.connect.bind(socket);
                    socket.connect = ((port, host) => connect({ port, host, family: 4 }));
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
            await this.$queryRaw `SELECT 1`;
        }
        catch {
            await this.$disconnect();
            await this.pool.end();
            throw new Error('Database connection failed. Check DATABASE_URL, Neon compute status, and network access to PostgreSQL port 5432.');
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
        await this.pool.end();
    }
};
PrismaService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], PrismaService);
export { PrismaService };
//# sourceMappingURL=prisma.service.js.map
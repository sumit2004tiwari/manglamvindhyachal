import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module.js';
import { UsersController } from './users.controller.js';

@Module({
  controllers: [UsersController],
  imports: [PrismaModule],
  exports: [PrismaModule],
})
export class UsersModule {}

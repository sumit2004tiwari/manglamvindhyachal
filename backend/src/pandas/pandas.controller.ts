import { Controller, Get, Post, Patch, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreatePandaDto } from './panda.dto.js';
import { PandasService } from './pandas.service.js';

@Controller('pandas')
export class PandasController {
  constructor(private readonly pandasService: PandasService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() createPandaDto: CreatePandaDto) {
    return this.pandasService.create(req.user.userId, createPandaDto);
  }

  @Get()
  findAll() {
    return this.pandasService.findAll();
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  update(@Request() req: any, @Body() dto: CreatePandaDto) {
    return this.pandasService.create(req.user.userId, dto, true);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pandasService.findOne(id);
  }
}

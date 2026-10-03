import { Controller, Get, Post, Patch, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service.js';
import { JwtAuthGuard, Public } from '../auth/jwt-auth.guard.js';
import { CreateListingDto, UpdateListingDto } from './listing.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}

  @Post()
  create(@Request() req: any, @Body() body: CreateListingDto) {
    return this.listingsService.create(req.user.userId, body);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req: any, @Body() body: UpdateListingDto) {
    return this.listingsService.update(id, req.user.userId, body);
  }
}

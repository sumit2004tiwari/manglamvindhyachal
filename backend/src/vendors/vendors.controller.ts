import { Controller, Get, Post, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service.js';
import { JwtAuthGuard, Public } from '../auth/jwt-auth.guard.js';
import { CreatePandaDto } from '../pandas/panda.dto.js';
import { PandasService } from '../pandas/pandas.service.js';
import { SetAvailabilityDto } from './availability.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('vendors')
export class VendorsController {
  constructor(private vendorsService: VendorsService, private pandasService: PandasService) {}

  @Public()
  @Get()
  search(
    @Query('category') category?: string,
    @Query('language') language?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minRating') minRating?: string,
    @Query('date') date?: string,
  ) {
    return this.vendorsService.search({
      category,
      language,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      date,
    });
  }

  @Get('me/profile')
  getMyProfile(@Request() req: any) {
    return this.vendorsService.getMyProfile(req.user.userId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  @Post('kyc')
  submitKyc(@Request() req: any, @Body() body: CreatePandaDto) {
    return this.pandasService.create(req.user.userId, body);
  }

  @Public()
  @Get(':id/availability')
  getAvailability(@Param('id') id: string, @Query('date') date?: string) {
    return this.vendorsService.getAvailability(id, date);
  }

  @Post(':id/availability')
  setAvailability(@Param('id') id: string, @Request() req: any, @Body() body: SetAvailabilityDto) {
    return this.vendorsService.setAvailability(req.user.userId, id, body.slots);
  }
}

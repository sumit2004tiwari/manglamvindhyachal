import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreateReviewDto } from './review.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  create(@Request() req: any, @Body() body: CreateReviewDto) {
    return this.reviewsService.create(req.user.userId, body);
  }
}

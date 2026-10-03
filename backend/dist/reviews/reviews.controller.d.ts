import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './review.dto.js';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    create(req: any, body: CreateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        vendorId: string;
        bookingId: string;
        rating: number;
        comment: string | null;
    }>;
}

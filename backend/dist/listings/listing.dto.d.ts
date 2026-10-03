export declare class CreateListingDto {
    type?: 'SERVICE' | 'PRODUCT';
    title: string;
    description: string;
    category: string;
    price: number;
    priceType?: 'FIXED' | 'STARTING_FROM' | 'QUOTE_ONLY';
    durationMinutes?: number;
    includesSamagri?: boolean;
    maxGroupSize?: number;
    photos?: string[];
}
export declare class UpdateListingDto {
    title?: string;
    description?: string;
    price?: number;
    status?: 'ACTIVE' | 'PAUSED';
    includesSamagri?: boolean;
    maxGroupSize?: number;
}

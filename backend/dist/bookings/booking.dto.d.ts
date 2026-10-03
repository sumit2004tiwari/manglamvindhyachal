export declare class CreateBookingDto {
    vendorId: string;
    listingId: string;
    slotId?: string;
    scheduledDate: string;
    groupSize: number;
    customerName: string;
    customerPhone: string;
    location: string;
    performedOnBehalfOf?: string;
    notes?: string;
}

import { IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateBookingDto {
  @IsString() @MinLength(1) vendorId: string;
  @IsString() @MinLength(1) listingId: string;
  @IsOptional() @IsString() slotId?: string;
  // An explicit offset prevents the server timezone from changing the chosen time.
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00(?:\.000)?(?:Z|[+-]\d{2}:\d{2})$/) scheduledDate: string;
  @IsInt() @Min(1) @Max(500) groupSize: number;
  @IsString() @MinLength(2) @MaxLength(100) customerName: string;
  @Matches(/^[6-9]\d{9}$/) customerPhone: string;
  @IsString() @MinLength(3) @MaxLength(1000) location: string;
  @IsOptional() @IsString() @MaxLength(1000) performedOnBehalfOf?: string;
  @IsOptional() @IsString() @MaxLength(3000) notes?: string;
}

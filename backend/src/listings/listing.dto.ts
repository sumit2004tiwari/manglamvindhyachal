import { IsArray, IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateListingDto {
  @IsOptional() @IsIn(['SERVICE', 'PRODUCT']) type?: 'SERVICE' | 'PRODUCT';
  @IsString() @MinLength(2) @MaxLength(200) title: string;
  @IsString() @MinLength(3) @MaxLength(5000) description: string;
  @IsString() @MinLength(1) @MaxLength(100) category: string;
  @IsNumber() @Min(0) @Max(10000000) price: number;
  @IsOptional() @IsIn(['FIXED', 'STARTING_FROM', 'QUOTE_ONLY']) priceType?: 'FIXED' | 'STARTING_FROM' | 'QUOTE_ONLY';
  @IsOptional() @IsInt() @Min(1) @Max(1440) durationMinutes?: number;
  @IsOptional() @IsBoolean() includesSamagri?: boolean;
  @IsOptional() @IsInt() @Min(1) @Max(500) maxGroupSize?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) photos?: string[];
}
export class UpdateListingDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(200) title?: string;
  @IsOptional() @IsString() @MinLength(3) @MaxLength(5000) description?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(10000000) price?: number;
  @IsOptional() @IsIn(['ACTIVE', 'PAUSED']) status?: 'ACTIVE' | 'PAUSED';
  @IsOptional() @IsBoolean() includesSamagri?: boolean;
  @IsOptional() @IsInt() @Min(1) @Max(500) maxGroupSize?: number;
}

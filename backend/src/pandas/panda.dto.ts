import { ArrayNotEmpty, IsArray, IsEmail, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreatePandaDto {
  @IsString() @MinLength(2) @MaxLength(100) name: string;
  @Matches(/^[6-9]\d{9}$/) phone: string;
  @IsOptional() @IsEmail() email?: string;
  @IsString() @MinLength(10) @MaxLength(3000) bio: string;
  @IsInt() @Min(0) @Max(100) experience: number;
  @IsArray() @ArrayNotEmpty() @IsString({ each: true }) languages: string[];
  @IsArray() @ArrayNotEmpty() @IsString({ each: true }) specialities: string[];
  @IsString() photoUrl: string;
  @Matches(/^\d{4}-\d{2}-\d{2}$/) dateOfBirth: string;
  @IsString() @MinLength(10) @MaxLength(1000) address: string;
  @Matches(/^(AADHAAR|PASSPORT|VOTER_ID)$/) identityType: string;
  @Matches(/^[A-Za-z0-9]{4}$/) identityLastFour: string;
  @IsString() identityDocument: string;
  @IsOptional() @IsString() @MaxLength(2000) lineageDetails?: string;
}

import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, Matches, ValidateNested } from 'class-validator';

export class AvailabilitySlotDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/) date: string;
  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/) startTime: string;
  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/) endTime: string;
}
export class SetAvailabilityDto {
  @IsArray() @ArrayNotEmpty() @ArrayMaxSize(100) @ValidateNested({ each: true }) @Type(() => AvailabilitySlotDto)
  slots: AvailabilitySlotDto[];
}

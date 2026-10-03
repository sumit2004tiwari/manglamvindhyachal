var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, Matches, ValidateNested } from 'class-validator';
export class AvailabilitySlotDto {
    date;
    startTime;
    endTime;
}
__decorate([
    Matches(/^\d{4}-\d{2}-\d{2}$/),
    __metadata("design:type", String)
], AvailabilitySlotDto.prototype, "date", void 0);
__decorate([
    Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    __metadata("design:type", String)
], AvailabilitySlotDto.prototype, "startTime", void 0);
__decorate([
    Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    __metadata("design:type", String)
], AvailabilitySlotDto.prototype, "endTime", void 0);
export class SetAvailabilityDto {
    slots;
}
__decorate([
    IsArray(),
    ArrayNotEmpty(),
    ArrayMaxSize(100),
    ValidateNested({ each: true }),
    Type(() => AvailabilitySlotDto),
    __metadata("design:type", Array)
], SetAvailabilityDto.prototype, "slots", void 0);
//# sourceMappingURL=availability.dto.js.map
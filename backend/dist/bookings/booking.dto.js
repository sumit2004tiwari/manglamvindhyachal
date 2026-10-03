var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';
export class CreateBookingDto {
    vendorId;
    listingId;
    slotId;
    scheduledDate;
    groupSize;
    customerName;
    customerPhone;
    location;
    performedOnBehalfOf;
    notes;
}
__decorate([
    IsString(),
    MinLength(1),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "vendorId", void 0);
__decorate([
    IsString(),
    MinLength(1),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "listingId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "slotId", void 0);
__decorate([
    Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00(?:\.000)?(?:Z|[+-]\d{2}:\d{2})$/),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "scheduledDate", void 0);
__decorate([
    IsInt(),
    Min(1),
    Max(500),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "groupSize", void 0);
__decorate([
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "customerName", void 0);
__decorate([
    Matches(/^[6-9]\d{9}$/),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "customerPhone", void 0);
__decorate([
    IsString(),
    MinLength(3),
    MaxLength(1000),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "location", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(1000),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "performedOnBehalfOf", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(3000),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "notes", void 0);
//# sourceMappingURL=booking.dto.js.map
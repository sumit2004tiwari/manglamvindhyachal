var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsArray, IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
export class CreateListingDto {
    type;
    title;
    description;
    category;
    price;
    priceType;
    durationMinutes;
    includesSamagri;
    maxGroupSize;
    photos;
}
__decorate([
    IsOptional(),
    IsIn(['SERVICE', 'PRODUCT']),
    __metadata("design:type", String)
], CreateListingDto.prototype, "type", void 0);
__decorate([
    IsString(),
    MinLength(2),
    MaxLength(200),
    __metadata("design:type", String)
], CreateListingDto.prototype, "title", void 0);
__decorate([
    IsString(),
    MinLength(3),
    MaxLength(5000),
    __metadata("design:type", String)
], CreateListingDto.prototype, "description", void 0);
__decorate([
    IsString(),
    MinLength(1),
    MaxLength(100),
    __metadata("design:type", String)
], CreateListingDto.prototype, "category", void 0);
__decorate([
    IsNumber(),
    Min(0),
    Max(10000000),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "price", void 0);
__decorate([
    IsOptional(),
    IsIn(['FIXED', 'STARTING_FROM', 'QUOTE_ONLY']),
    __metadata("design:type", String)
], CreateListingDto.prototype, "priceType", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1),
    Max(1440),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "durationMinutes", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateListingDto.prototype, "includesSamagri", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1),
    Max(500),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "maxGroupSize", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateListingDto.prototype, "photos", void 0);
export class UpdateListingDto {
    title;
    description;
    price;
    status;
    includesSamagri;
    maxGroupSize;
}
__decorate([
    IsOptional(),
    IsString(),
    MinLength(2),
    MaxLength(200),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "title", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MinLength(3),
    MaxLength(5000),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsNumber(),
    Min(0),
    Max(10000000),
    __metadata("design:type", Number)
], UpdateListingDto.prototype, "price", void 0);
__decorate([
    IsOptional(),
    IsIn(['ACTIVE', 'PAUSED']),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "status", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateListingDto.prototype, "includesSamagri", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1),
    Max(500),
    __metadata("design:type", Number)
], UpdateListingDto.prototype, "maxGroupSize", void 0);
//# sourceMappingURL=listing.dto.js.map
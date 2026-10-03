var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArrayNotEmpty, IsArray, IsEmail, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';
export class CreatePandaDto {
    name;
    phone;
    email;
    bio;
    experience;
    languages;
    specialities;
    photoUrl;
    dateOfBirth;
    address;
    identityType;
    identityLastFour;
    identityDocument;
    lineageDetails;
}
__decorate([
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], CreatePandaDto.prototype, "name", void 0);
__decorate([
    Matches(/^[6-9]\d{9}$/),
    __metadata("design:type", String)
], CreatePandaDto.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    IsEmail(),
    __metadata("design:type", String)
], CreatePandaDto.prototype, "email", void 0);
__decorate([
    IsString(),
    MinLength(10),
    MaxLength(3000),
    __metadata("design:type", String)
], CreatePandaDto.prototype, "bio", void 0);
__decorate([
    IsInt(),
    Min(0),
    Max(100),
    __metadata("design:type", Number)
], CreatePandaDto.prototype, "experience", void 0);
__decorate([
    IsArray(),
    ArrayNotEmpty(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreatePandaDto.prototype, "languages", void 0);
__decorate([
    IsArray(),
    ArrayNotEmpty(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreatePandaDto.prototype, "specialities", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreatePandaDto.prototype, "photoUrl", void 0);
__decorate([
    Matches(/^\d{4}-\d{2}-\d{2}$/),
    __metadata("design:type", String)
], CreatePandaDto.prototype, "dateOfBirth", void 0);
__decorate([
    IsString(),
    MinLength(10),
    MaxLength(1000),
    __metadata("design:type", String)
], CreatePandaDto.prototype, "address", void 0);
__decorate([
    Matches(/^(AADHAAR|PASSPORT|VOTER_ID)$/),
    __metadata("design:type", String)
], CreatePandaDto.prototype, "identityType", void 0);
__decorate([
    Matches(/^[A-Za-z0-9]{4}$/),
    __metadata("design:type", String)
], CreatePandaDto.prototype, "identityLastFour", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreatePandaDto.prototype, "identityDocument", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], CreatePandaDto.prototype, "lineageDetails", void 0);
//# sourceMappingURL=panda.dto.js.map
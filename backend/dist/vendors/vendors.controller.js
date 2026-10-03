var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service.js';
import { JwtAuthGuard, Public } from '../auth/jwt-auth.guard.js';
import { CreatePandaDto } from '../pandas/panda.dto.js';
import { PandasService } from '../pandas/pandas.service.js';
import { SetAvailabilityDto } from './availability.dto.js';
let VendorsController = class VendorsController {
    vendorsService;
    pandasService;
    constructor(vendorsService, pandasService) {
        this.vendorsService = vendorsService;
        this.pandasService = pandasService;
    }
    search(category, language, minPrice, maxPrice, minRating, date) {
        return this.vendorsService.search({
            category,
            language,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            minRating: minRating ? parseFloat(minRating) : undefined,
            date,
        });
    }
    getMyProfile(req) {
        return this.vendorsService.getMyProfile(req.user.userId);
    }
    findOne(id) {
        return this.vendorsService.findOne(id);
    }
    submitKyc(req, body) {
        return this.pandasService.create(req.user.userId, body);
    }
    getAvailability(id, date) {
        return this.vendorsService.getAvailability(id, date);
    }
    setAvailability(id, req, body) {
        return this.vendorsService.setAvailability(req.user.userId, id, body.slots);
    }
};
__decorate([
    Public(),
    Get(),
    __param(0, Query('category')),
    __param(1, Query('language')),
    __param(2, Query('minPrice')),
    __param(3, Query('maxPrice')),
    __param(4, Query('minRating')),
    __param(5, Query('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "search", null);
__decorate([
    Get('me/profile'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "getMyProfile", null);
__decorate([
    Public(),
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "findOne", null);
__decorate([
    Post('kyc'),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreatePandaDto]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "submitKyc", null);
__decorate([
    Public(),
    Get(':id/availability'),
    __param(0, Param('id')),
    __param(1, Query('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "getAvailability", null);
__decorate([
    Post(':id/availability'),
    __param(0, Param('id')),
    __param(1, Request()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, SetAvailabilityDto]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "setAvailability", null);
VendorsController = __decorate([
    UseGuards(JwtAuthGuard),
    Controller('vendors'),
    __metadata("design:paramtypes", [VendorsService, PandasService])
], VendorsController);
export { VendorsController };
//# sourceMappingURL=vendors.controller.js.map
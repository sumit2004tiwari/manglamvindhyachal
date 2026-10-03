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
import { Controller, Get, Post, Patch, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreatePandaDto } from './panda.dto.js';
import { PandasService } from './pandas.service.js';
let PandasController = class PandasController {
    pandasService;
    constructor(pandasService) {
        this.pandasService = pandasService;
    }
    create(req, createPandaDto) {
        return this.pandasService.create(req.user.userId, createPandaDto);
    }
    findAll() {
        return this.pandasService.findAll();
    }
    update(req, dto) {
        return this.pandasService.create(req.user.userId, dto, true);
    }
    findOne(id) {
        return this.pandasService.findOne(id);
    }
};
__decorate([
    Post(),
    UseGuards(JwtAuthGuard),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreatePandaDto]),
    __metadata("design:returntype", void 0)
], PandasController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PandasController.prototype, "findAll", null);
__decorate([
    Patch('me'),
    UseGuards(JwtAuthGuard),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreatePandaDto]),
    __metadata("design:returntype", void 0)
], PandasController.prototype, "update", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PandasController.prototype, "findOne", null);
PandasController = __decorate([
    Controller('pandas'),
    __metadata("design:paramtypes", [PandasService])
], PandasController);
export { PandasController };
//# sourceMappingURL=pandas.controller.js.map
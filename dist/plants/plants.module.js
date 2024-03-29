"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantsModule = void 0;
const common_1 = require("@nestjs/common");
const plants_service_1 = require("./plants.service");
const plants_controller_1 = require("./plants.controller");
const typeorm_1 = require("@nestjs/typeorm");
const plant_entity_1 = require("./entities/plant.entity");
const device_entity_1 = require("../devices/entities/device.entity");
const aws_service_1 = require("../aws/aws.service");
const axios_1 = require("@nestjs/axios");
const bookmark_entity_1 = require("./entities/bookmark.entity");
const disease_entity_1 = require("./entities/disease.entity");
const plant_diagnose_entity_1 = require("./entities/plant-diagnose.entity");
let PlantsModule = class PlantsModule {
};
exports.PlantsModule = PlantsModule;
exports.PlantsModule = PlantsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([plant_entity_1.Plant, device_entity_1.Device, bookmark_entity_1.Bookmark, disease_entity_1.Disease, plant_diagnose_entity_1.PlantDisease]),
            axios_1.HttpModule,
        ],
        controllers: [plants_controller_1.PlantsController],
        providers: [plants_service_1.PlantsService, aws_service_1.AwsService],
    })
], PlantsModule);
//# sourceMappingURL=plants.module.js.map
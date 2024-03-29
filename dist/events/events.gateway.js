"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let EventsGateway = class EventsGateway {
    constructor() {
        this.logger = new common_1.Logger('EventsGateway');
    }
    handleMessage(client, payload) {
        return 'Hello world!';
    }
    handleEvent(data) {
        return data;
    }
    afterInit(server) {
        this.logger.log('웹소켓 서버 초기화 ✅');
    }
    handleDisconnect(client) {
        this.logger.log(`Client Disconnected : ${client.id}`);
    }
    handleConnection(client, ...args) {
        this.logger.log(`Client Connected : ${client.id}`);
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", String)
], EventsGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('events'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], EventsGateway.prototype, "handleEvent", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3001, {
        namespace: 'events',
        cors: { origin: '*' },
    }),
    __metadata("design:paramtypes", [])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map
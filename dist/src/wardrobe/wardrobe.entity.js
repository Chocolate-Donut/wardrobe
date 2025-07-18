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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wardrobe = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let Wardrobe = class Wardrobe {
};
exports.Wardrobe = Wardrobe;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Wardrobe.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Wardrobe.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], Wardrobe.prototype, "colors", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Wardrobe.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { default: "" }),
    __metadata("design:type", Array)
], Wardrobe.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Wardrobe.prototype, "season", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Wardrobe.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.wardrobe),
    __metadata("design:type", user_entity_1.User)
], Wardrobe.prototype, "user", void 0);
__decorate([
    (0, typeorm_2.CreateDateColumn)(),
    __metadata("design:type", Date)
], Wardrobe.prototype, "createdAt", void 0);
exports.Wardrobe = Wardrobe = __decorate([
    (0, typeorm_1.Entity)()
], Wardrobe);
//# sourceMappingURL=wardrobe.entity.js.map
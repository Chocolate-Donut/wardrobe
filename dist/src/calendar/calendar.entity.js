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
exports.Calendar = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const outfit_entity_1 = require("../outfits/outfit.entity/outfit.entity");
let Calendar = class Calendar {
};
exports.Calendar = Calendar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Calendar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Calendar.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Calendar.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.calendar),
    __metadata("design:type", user_entity_1.User)
], Calendar.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => outfit_entity_1.Outfit, (outfit) => outfit.calendar),
    __metadata("design:type", Array)
], Calendar.prototype, "outfits", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Calendar.prototype, "isImportant", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Object)
], Calendar.prototype, "events", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Calendar.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Calendar.prototype, "weatherType", void 0);
exports.Calendar = Calendar = __decorate([
    (0, typeorm_1.Entity)()
], Calendar);
//# sourceMappingURL=calendar.entity.js.map
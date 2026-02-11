"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStatsKPI = void 0;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const getUserStatsKPI = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUser = yield prisma_1.default.user.count();
    const usersInLast30Days = yield prisma_1.default.user.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
        },
    });
    const usersInPrev30Days = yield prisma_1.default.user.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                lte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            },
        },
    });
    const changeInUsers = usersInLast30Days - usersInPrev30Days;
    const userGrowth = usersInPrev30Days === 0
        ? usersInLast30Days === 0
            ? 0
            : 100
        : Number((changeInUsers / usersInPrev30Days) * 100).toFixed(1);
    console.log(totalUser, userGrowth);
    return {
        totalUser,
        userGrowth,
    };
});
exports.getUserStatsKPI = getUserStatsKPI;

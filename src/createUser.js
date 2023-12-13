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
exports.createUser = void 0;
const db_1 = require("@sveltekit-board/db");
const error_1 = require("./error");
const getUser_1 = __importDefault(require("./getUser"));
function createUser(option) {
    return __awaiter(this, void 0, void 0, function* () {
        let email;
        if (option.email) {
            email = option.email;
        }
        else {
            email = null;
        }
        if (yield getUser_1.default.byId(option.id)) {
            throw new error_1.UserError("DUPLICATED_ID");
        }
        if (option.email) {
            if (yield getUser_1.default.byEmail(option.email)) {
                throw new error_1.UserError("DUPLICATED_EMAIL");
            }
        }
        if (yield getUser_1.default.byNickname(option.nickname)) {
            throw new error_1.UserError("DUPLICATED_NICKNAME");
        }
        try {
            yield (0, db_1.runQuery)((run) => __awaiter(this, void 0, void 0, function* () {
                return yield run("INSERT INTO `user` (`id`, `password`, `email`, `verified`, `nickname`,`grade`, `register_ip`, `nick_date`, `register_date`) VALUES (?, ?, ?,?, ?, ?, ?, NOW(), NOW())", [option.id, option.password, email, option.verified, option.nickname, option.grade, option.registerIp]);
            }));
        }
        catch (err) {
            throw new error_1.UserError("DATABASE_ERROR", '데이터베이스 오류', err);
        }
        return true;
    });
}
exports.createUser = createUser;

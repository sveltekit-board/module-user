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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@sveltekit-board/db");
const error_1 = require("./error");
let byId = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield (0, db_1.runQuery)((run) => __awaiter(this, void 0, void 0, function* () {
                return yield run("SELECT * FROM `user` WHERE `id` = ?", [id]);
            }));
            return result['0'];
        }
        catch (err) {
            throw new error_1.UserError('DATABASE_ERROR', undefined, err);
        }
    });
};
let byNickname = function (nickname) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield (0, db_1.runQuery)((run) => __awaiter(this, void 0, void 0, function* () {
                return yield run("SELECT * FROM `user` WHERE `nickname` = ?", [nickname]);
            }));
            return result['0'];
        }
        catch (err) {
            throw new error_1.UserError('DATABASE_ERROR', undefined, err);
        }
    });
};
let byEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield (0, db_1.runQuery)((run) => __awaiter(this, void 0, void 0, function* () {
                return yield run("SELECT * FROM `user` WHERE `email` = ?", [email]);
            }));
            return result['0'];
        }
        catch (err) {
            throw new error_1.UserError('DATABASE_ERROR', undefined, err);
        }
    });
};
let byIdPassword = function (id, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield (0, db_1.runQuery)((run) => __awaiter(this, void 0, void 0, function* () {
                return yield run("SELECT * FROM `user` WHERE `id` = ? AND `password` = ?", [id, password]);
            }));
            return result['0'];
        }
        catch (err) {
            throw new error_1.UserError('DATABASE_ERROR', undefined, err);
        }
    });
};
const getUser = {
    byId,
    byNickname,
    byEmail,
    byIdPassword
};
exports.default = getUser;

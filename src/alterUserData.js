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
let alterNickname = function (id, nickname) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, db_1.runQuery)((run) => __awaiter(this, void 0, void 0, function* () {
                let same = false;
                try {
                    let r = (yield run("SELECT * FROM `user` WHERE `id` = ? AND `nickname` = ?", [id, nickname]))['0'];
                    if (r) {
                        same = true;
                    }
                }
                catch (err) {
                    throw new error_1.UserError("DATABASE_ERROR", undefined, err);
                }
                if (same) {
                    throw new error_1.UserError("SAME_NICKNAME");
                }
                try {
                    yield run("UPDATE `user` SET `nickname` = ? WHERE `id` = ?", [nickname, id]);
                }
                catch (err) {
                    throw new error_1.UserError("DATABASE_ERROR", undefined, err);
                }
                return true;
            }));
        }
        catch (err) {
            throw err;
        }
    });
};
let alterPassword = function (id, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, db_1.runQuery)((run) => __awaiter(this, void 0, void 0, function* () {
                let same = false;
                try {
                    let r = (yield run("SELECT * FROM `user` WHERE `id` = ? AND `password` = ?", [id, password]))['0'];
                    if (r) {
                        same = true;
                    }
                }
                catch (err) {
                    throw new error_1.UserError("DATABASE_ERROR", undefined, err);
                }
                if (same) {
                    throw new error_1.UserError("SAME_PASSWORD");
                }
                try {
                    yield run("UPDATE `user` SET `password` = ? WHERE `id` = ?", [password, id]);
                }
                catch (err) {
                    throw new error_1.UserError("DATABASE_ERROR", undefined, err);
                }
                return true;
            }));
        }
        catch (err) {
            throw err;
        }
    });
};
let alterGrade = function (id, grade) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, db_1.runQuery)((run) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield run("UPDATE `user` SET `grade` = ? WHERE `id` = ?", [grade, id]);
                }
                catch (err) {
                    throw new error_1.UserError("DATABASE_ERROR", undefined, err);
                }
                return true;
            }));
        }
        catch (err) {
            throw err;
        }
    });
};
const alterUserData = {
    alterNickname,
    alterPassword,
    alterGrade
};
exports.default = alterUserData;

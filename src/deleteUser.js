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
exports.deleteUser = void 0;
const db_1 = require("@sveltekit-board/db");
const error_1 = require("./error");
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let r = yield (0, db_1.runQuery)((run) => __awaiter(this, void 0, void 0, function* () {
                return yield run("DELETE FROM `user` WHERE `id` = ?", [id]);
            }));
            if (r.affectedRows == 0) {
                throw new error_1.UserError("INVALID_ID");
            }
            else {
                return true;
            }
        }
        catch (err) {
            throw new error_1.UserError("DATABASE_ERROR", undefined, err);
        }
    });
}
exports.deleteUser = deleteUser;

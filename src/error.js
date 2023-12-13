"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserError = void 0;
class UserError extends Error {
    constructor(code, message, sqlError) {
        super(message);
        this.code = code;
        this.sqlError = sqlError;
    }
}
exports.UserError = UserError;

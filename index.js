"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alterUserData_1 = __importDefault(require("./src/alterUserData"));
const createUser_1 = require("./src/createUser");
const deleteUser_1 = require("./src/deleteUser");
const getUser_1 = __importDefault(require("./src/getUser"));
const user = {
    alterUserData: alterUserData_1.default,
    createUser: createUser_1.createUser,
    deleteUser: deleteUser_1.deleteUser,
    getUser: getUser_1.default
};
exports.default = user;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("./userModel");
function getAllUsers() {
    try {
        const all = userModel_1.User.findAll();
        return all;
    }
    catch (error) {
        console.error(error);
    }
}
function getUserByName(username) {
    try {
        const name = userModel_1.User.findOne({ where: { username } });
        return name;
    }
    catch (error) {
        console.error(error);
    }
}
exports.default = userModel_1.User;

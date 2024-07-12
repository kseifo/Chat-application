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
exports.UserService = void 0;
const userModel_1 = require("./userModel");
class UserService {
    constructor() {
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield (0, userModel_1.addUser)(req.body.username);
                console.log('User created');
                res.redirect('/onlineusers.html');
            }
            catch (error) {
                return res.status(400).json({ error: 'Error creating user' });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.User.findAll();
                return users;
            }
            catch (error) {
                return res.status(500).json({ error: 'Error fetching users' });
            }
        });
    }
    getOnlineUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.User.findAll({ where: { isDeleted: false } });
                return users;
            }
            catch (error) {
                return res.status(500).json({ error: 'Error fetching online users' });
            }
        });
    }
    deleteUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedUser = yield (0, userModel_1.deleteUser)(username);
                if (deletedUser) {
                    console.log("User deleted");
                }
                else {
                    console.log("User not found");
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.UserService = UserService;
exports.default = UserService;

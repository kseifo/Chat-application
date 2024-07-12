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
exports.deleteUser = exports.addUser = exports.User = void 0;
const sequelize_1 = require("sequelize");
const db_js_1 = require("./../../middlewares/db.js");
const sequelize_2 = require("sequelize");
class User extends sequelize_2.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    isDeleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    modelName: 'user',
    sequelize: db_js_1.db
});
function sync() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_js_1.db.sync({ force: true });
            console.log("Tables created");
        }
        catch (error) {
            console.error(error);
        }
    });
}
sync();
function addUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newUser = yield User.create({ username });
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.addUser = addUser;
function deleteUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [updatedRows] = yield User.update({ isDeleted: true }, { where: { username } });
            if (updatedRows > 0) {
                return 1;
            }
            else {
                return 0;
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.deleteUser = deleteUser;
function getUser(id) {
    try {
        const target = User.findByPk(id);
        if (target) {
            return target;
        }
        else {
            console.log("User not found");
        }
    }
    catch (error) {
        console.error(error);
    }
}

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
const dbb = require('./../middlewares/db');
const { Sequelizee, DataTypes } = require('sequelize');
let sql = "DROP TABLE IF EXISTS users;";
// dbb.query(sql, (err: any, result: any) => {
//     if (err) throw err;
//     console.log("Table deleted");
//     });
// sql = "DROP TABLE IF EXISTS messages;";
// dbb.query(sql, (err: any, result: any) => {
//     if (err) throw err;
//     console.log("Table deleted");
//     });
// sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) UNIQUE, password VARCHAR(255));";
// dbb.query(sql, (err: any, result: any) => {
//   if (err) throw err;
//   console.log("Table created");
// });
// sql = "CREATE TABLE messages (id INT AUTO_INCREMENT PRIMARY KEY, message VARCHAR(255));";
// dbb.query(sql, (err: any, result: any) => {
//   if (err) throw err;
//   console.log("Table created");
// });
const user = dbb.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
});
const message = dbb.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    message: {
        type: DataTypes.STRING,
    },
});
function sync() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield dbb.sync({ force: true });
            console.log("Tables created");
        }
        catch (error) {
            console.error('Failed to create tables:', error);
        }
    });
}
sync();

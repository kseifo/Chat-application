import { DataTypes, Sequelize } from 'sequelize';
import { db } from './../../middlewares/db.js';
import { Model } from 'sequelize';
const bcrypt = require('bcrypt');

export class User extends Model {
    public password!: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    modelName: 'user',
    sequelize: db
});

User.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
});

async function sync() {
    try {
        await db.sync({force: true});
    } catch (error) {
        console.error(error);
    }
}
sync();

export async function addUser(username: string, password: string) {
    try {
        const newUser = await User.create({ username: username, password: password });
    } catch (error) {
        console.error(error);
    }
}

export async function deleteUser(username: string) {
    try {
        const user = await User.findOne({ where: { username } });
        if (user) {
            await User.update({ isDeleted: true }, { where: { username } });
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.error(error);
    }
}

export async function makeUserOnline(username: string) {
    try {
        const user = await User.findOne({ where: { username } });
        if (user) {
            await User.update({ isDeleted: false }, { where: { username } });
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getUserbyName(username: string) {
    try {
        const target = await User.findOne({ where: { username } });
        if (target) {
            return target;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getHashedPassword(username: string) {
    try {
        const target = await User.findOne({ where: { username } });
        if (target) {
            return target.password;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
    }
}

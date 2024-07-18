import { DataTypes, Sequelize } from 'sequelize';
import {db} from './../../middlewares/db.js';
import {Model} from 'sequelize';
import {Op} from 'sequelize';

export class Message extends Model{}

Message.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recipient: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW 
    },
}, {
    modelName: 'message',
    sequelize: db
});

async function sync() {
    try {
        await db.sync();
        console.log("Tables created");
    } catch (error) {
        console.error(error);
    }
}
sync();

export async function addMessage(message: string, sender: string, recipient: string){
    try{
        const newMsg = await Message.create({message: message, sender: sender, recipient: recipient});
    }
    catch(error){
        console.log(error)
    }
}

export async function getMessages(sender: string, recipient: string){
    try{
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender: sender, recipient: recipient },
                    { sender: recipient, recipient: sender }
                ]
            },
            order: [['createdAt', 'ASC']]
        });
        return messages;
    }
    catch(error){
        console.log(error);
    }
}
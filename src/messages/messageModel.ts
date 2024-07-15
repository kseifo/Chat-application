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
    reciever: {
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
        await db.sync({ force: true });
        console.log("Tables created");
    } catch (error) {
        console.error(error);
    }
}
sync();

export async function addMessage(message: string, sender: string, receiver: string){
    try{
        const newMsg = await Message.create({message: message, sender: sender, receiver: receiver});
    }
    catch(error){
        console.log(error)
    }
}

export async function getMessages(sender: string, receiver: string){
    try{
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender: sender, receiver: receiver },
                    { sender: receiver, receiver: sender }
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
import { Request, Response } from 'express';
import { Message, addMessage, getMessages } from './messageModel';

export class MessageController{
    constructor(){

    }
    public async createMessage(req: Request, res: Response){
        try{
            const newMessage = await addMessage(req.body.message, req.body.sender, req.body.recipient);
            console.log('Message created');
        }
        catch(error){
            return console.log(error);
        }
    }

    public async getMessages(req: Request, res: Response){
        try{
            const messages = await getMessages(req.body.sender, req.body.recipient);
            return messages;
        }
        catch(error){
            console.log(error);
        }
    }
}

export default MessageController;
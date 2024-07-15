import { Request, Response } from 'express';
import { Message, addMessage, getMessages } from './messageModel';

export class MessageController{
    constructor(){

    }
    public async createMessage(req: Request, res: Response){
        try{
            const newMessage = await addMessage(req.body.message, req.body.sender, req.body.receiver);
            console.log('Message created');
            res.redirect('/messages.html');
        }
        catch(error){
            return res.status(400).json({error: 'Error creating message'});
        }
    }

    public async getMessages(req: Request, res: Response){
        try{
            const messages = await getMessages(req.body.sender, req.body.receiver);
            return messages;
        }
        catch(error){
            return res.status(500).json({error: 'Error fetching messages'});
        }
    }
}

export default MessageController;
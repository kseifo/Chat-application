
import { Request, Response } from 'express';
import { User, addUser, deleteUser } from './userModel';

export class UserService {

  constructor(){
    
  }
  public async createUser(req: Request, res: Response) {
    try {
      const newUser = await addUser(req.body.username);
      console.log('User created');
      res.redirect('/onlineusers.html');
    } catch (error) {
      return res.status(400).json({ error: 'Error creating user' });
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching users' });
    }
  }

  public async getOnlineUsers(req: Request, res: Response){
    try{
      const users = await User.findAll({where: {isDeleted: false}});
      return users;
    }
    catch(error){
      return res.status(500).json({error: 'Error fetching online users'});
    }
  }

  public async deleteUser(username: string) {
    try {
      const deletedUser = await deleteUser(username);
      if (deletedUser) {
        console.log("User deleted");
      } else {
        console.log("User not found");
      }
    }
    catch (error) {
      console.error(error);
    }
  }
}

export default UserService;
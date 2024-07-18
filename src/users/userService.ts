
import { Request, Response } from 'express';
import { User, addUser, deleteUser, getUserbyName, getHashedPassword } from './userModel';

export class UserService {

  constructor(){
    
  }
  public async createUser(req: Request, res: Response) {
    try {
      const newUser = await addUser(req.body.username, req.body.password);
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
      throw error;
    }
  }

  public async getOnlineUsers(req: Request, res: Response){
    try{
      const users = await User.findAll({where: {isDeleted: false}});
      return users;
    }
    catch(error){
      throw error;
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

  public async getUserName(username: string) {
    try {
      const target = getUserbyName(username);
      if (target!=null) {
        return target;
      }
      else {
        console.log("User not found");
        return null;
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  public async makeUserOnline(req: Request, res: Response) {
    try {
      const updatedRows = await User.update({ isDeleted: false }, { where: { username: req.body.username } });
      res.redirect('/onlineusers.html');
      if (updatedRows[0] == 1) {
        console.log("User is now online");
      } else {
        console.log("User not found");
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  public async getHashedPassword(username: string) {
    try{
      const target = getHashedPassword(username);

      if(target){
        return target;
      }
      else{
        return null;
      }
    }
    catch(error){
      throw error;
    }
  }
}

export default UserService;
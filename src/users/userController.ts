import { User } from './userModel';

function getAllUsers(){
    try{
        const all = User.findAll();
        return all;
    }
    catch(error){
        console.error(error);
    }
}

function getUserByName(username: string){
    try{
        const name = User.findOne({where: {username}});
        return name;
    }
    catch(error){
        console.error(error);
    }
}

export default User;

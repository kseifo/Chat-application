import { DataTypes, Sequelize } from 'sequelize';
import {db} from './../../middlewares/db.js';
import {Model} from 'sequelize';
export class User extends Model{}

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
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
    }, {
      modelName: 'user',
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

export async function addUser(username: string){
    try{
        const newUser = await User.create({ username});
    }catch(error){
        console.error(error);
    }
}

export async function deleteUser(username: string){
    try{
        const [updatedRows] = await User.update({ isDeleted: true }, { where: { username } });
        if(updatedRows > 0){
            return 1;
        }else{
            return 0;
        }
    }
    catch(error){
        console.error(error);
    }
}

function getUser(id: number){
    try{
        const target = User.findByPk(id);
        if(target){
            return target;
        }
        else{
            console.log("User not found");
        }
    }
    catch(error){
        console.error(error);
    }
}

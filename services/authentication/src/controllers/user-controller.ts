// User Model
import IUser from '../interfaces/user-interface';
import UserModel from '../models/user-model'

async function createUser(name: string, tokenNotification: string): Promise<IUser | false> {
    try{
        const user: IUser = await UserModel.create({
            name, 'token-notification': tokenNotification
        })
        return user;
    }catch(e){
        return false;
    }
}

async function getDataUser(idUser: number): Promise<IUser | false> {
    try{
        const user = await UserModel.findById(idUser)
        return user === null ? false : user
    }catch(e){
        return false;
    }
}

export { createUser, getDataUser }
// User Model
import UserModel from '../models/user-model'

// Interfaces
import IUser from '../interfaces/user-interface';

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

async function deleteUser(_id: number): Promise<IUser | false> {
    try{
        const user = await UserModel.findByIdAndDelete(_id)
        return user;
    }catch(e){
        return false;
    }
}

async function updateUser(_id: number, data: object): Promise<IUser | false> {
    try{
        const user = await UserModel.findByIdAndUpdate(_id, data)
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

export { createUser, deleteUser, updateUser, getDataUser }
// User Model
import UserModel from '../models/user-model'
// Interfaces
import IUser from '../interfaces/user-interface';

async function searchUser(name: string,): Promise<IUser[] | null> {
    const users: IUser[] | null = await UserModel.find({ where: { name } })
    return users;
}

export { searchUser }
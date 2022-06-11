import { S3 } from 'aws-sdk';

// User Model
import UserModel from '../models/user-model'
import VerifyEmail from '../models/verify-email-model';

// Interfaces
import IUser from '../interfaces/user-interface';

// Controllers
import { cryptPassword } from './crypt-controller';
import { setS3, uploadAWS } from './upload-controller';

// Services
import NodeMailer from '../services/nodemailer-service';

// Define NodeMailer service
const mailer = new NodeMailer();

let s3: S3;

(async () => {
    s3 = await setS3();
})()

async function createUser(name: string, tokenNotification: string, email: string, password: string, image: Buffer): Promise<IUser | false> {
    const cryptedPassword = await cryptPassword(password)
    const nameLowerCase = name.toLowerCase().split(' ')
    const nick = nameLowerCase.join('')
    try {

        const urlImage = await uploadAWS(s3, nick, image)

        if (urlImage === null) return false;

        const user: IUser = await UserModel.create({
            _id: nick,
            name, 'token-notification': tokenNotification, email, password: cryptedPassword, image: urlImage
        })

        const verifyEmail = await VerifyEmail.create({
            email, idUser: user._id,
        })
        const { id } = verifyEmail.toJSON();

        await mailer.sendEmail(email, name, id)

        return user;
    } catch (e) {
        console.log(e)
        return false;
    }
}

async function deleteUser(_id: string): Promise<IUser | false> {
    try {
        const user = await UserModel.findByIdAndDelete(_id)
        if (user === null) return false;
        return user;
    } catch (e) {
        return false;
    }
}

async function updateUser(_id: string, data: object): Promise<IUser | false> {
    try {
        const update = await UserModel.findByIdAndUpdate(_id, data)
        if (update === null) return false;
        return await getDataUser(_id)
    } catch (e) {
        return false;
    }
}

async function updateToken(_id: string, token: string): Promise<IUser | false> {
    try {
        const update = await UserModel.findByIdAndUpdate(_id, {
            $set: {
                'token-notification': token
            }
        })
        if (update === null) return false;
        return await getDataUser(_id)
    } catch (e) {
        return false;
    }
}

async function getDataUser(_id: string): Promise<IUser | false> {
    try {
        const user = await UserModel.findById(_id)
        return user === null ? false : user
    } catch (e) {
        return false;
    }
}

async function verifyAccount(email: string) {
    try {
        const user: IUser | null = await UserModel.findOne({
            email
        })
        if (user === null) return false;
        return user
    } catch (error) {
        console.log(error)
        return false;
    }
}

export { createUser, deleteUser, updateUser, updateToken, getDataUser, verifyAccount }
import mongoose from 'mongoose';

export default async function connection() {
    try {
        await mongoose.connect('mongodb://mongodb', {
            pass: String(process.env.PASSWORD_MONGO),
            user: String(process.env.USERNAME_MONGO)
        })
        console.log('Conectado com sucesso')
    } catch (e) {
        console.log(e)
    }
}
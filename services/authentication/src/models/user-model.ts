import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {
        required: false,
        type: Number,
        default: () => {
            return new Date().getTime()
        }
    },
    name: {
        required: true,
        minlength: 4,
        type: String
    },
    'token-notification': {
        required: true,
        minlength: 48,
        type: String
    },
    followers: {
        required: false,
        type: Array,
        default: []
    }
})

const UserModel = mongoose.model('user', userSchema)

export default UserModel
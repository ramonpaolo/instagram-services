import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {
        required: true,
        type: String,
    },
    name: {
        required: true,
        minlength: 4,
        type: String
    },
    image: {
        required: true,
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
    },
    following: {
        required: false,
        type: Array,
        default: []
    },
    email: {
        required: true,
        type: String,
        minlength: 12
    },
    'verified-email': {
        type: Boolean,
        default: false
    },
    password: {
        required: true,
        type: String,
    },
})

const UserModel = mongoose.model('user', userSchema)

export default UserModel
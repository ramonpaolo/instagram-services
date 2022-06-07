import UserModel from '../models/user-model';

async function addFollower(_id: string, _idFollower: string) {
    try {
        await UserModel.findByIdAndUpdate(_id, { $push: { followers: _idFollower } })
        return true
    } catch (error) {
        console.log(error)
        return false;
    }
}

async function addFollowing(_id: string, _idFollower: string) {
    try {
        await UserModel.findByIdAndUpdate(_idFollower, { $push: { following: _id } })
        return true
    } catch (error) {
        console.log(error)
        return false;
    }
}

async function removeFollower(_id: string, _idFollower: string) {
    try {
        await UserModel.findByIdAndUpdate(_id, { $pull: { followers: _idFollower } })
        return true
    } catch (error) {
        console.log(error)
        return false;
    }
}

async function removeFollowing(_id: string, _idFollower: string) {
    try {
        await UserModel.findByIdAndUpdate(_idFollower, { $pull: { following: _id } })
        return true
    } catch (error) {
        console.log(error)
        return false;
    }
}

export { addFollower, addFollowing, removeFollower, removeFollowing}
import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
    _id: {
        required: true,
        default: () => {
            return new Date().getTime()
        },
        type: Number
    },
    text: {
        type: String,
        required: false,
        
    }, 
    images: {
        type: Array<string>,
        required: true,
        minlength: 0,
        maxlength: 5
    },
    _idOwner: {
        type: Number,
        required: true
    }
})

const PublicationModel = mongoose.model('publication', publicationSchema)

export default PublicationModel;
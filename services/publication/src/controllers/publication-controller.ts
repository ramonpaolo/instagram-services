// Interfaces
import IPublication from '../interfaces/publication-interface';

// Models
import PublicationModel from '../models/publication-model';

async function createPublication(publication_data: {text: string, _idOwner: number, images: string[], author: string}) {
    try {
        const publication: IPublication = await PublicationModel.create(publication_data)
        return publication
    } catch (e) {
        console.log(e)
        return false;
    }
}

async function getPublication(_id: number) {
    try {
        const publication = await PublicationModel.findById(_id)
        console.log(publication)
        return publication
    } catch (e) {
        console.log(e)
        return false;
    }
}

async function getPublicationByUser(_idOwner: number) {
    try {
        const publication = await PublicationModel.find({_idOwner:_idOwner})
        console.log(publication)
        return publication
    } catch (e) {
        console.log(e)
        return false;
    }
}

async function getPublications() {
    try {
        const publications: IPublication[] = await PublicationModel.find()
        return publications
    } catch (e) {
        console.log(e)
        return false;
    }
}

export { createPublication, getPublication, getPublicationByUser, getPublications }
// Interfaces
import IPublication from '../interfaces/publication-interface';

// Models
import PublicationModel from '../models/publication-model';

async function createPublication(publication_data: { text: string, _idOwner: string, images: string[], author: string }) {
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

async function getPublicationByUser(_idOwner: string) {
    try {
        const publication = await PublicationModel.find({ _idOwner })
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

async function deletePublicationByUser(_id: number) {
    try {
        const publications: IPublication | null = await PublicationModel.findByIdAndDelete(_id);
        return publications
    } catch (e) {
        console.log(e)
        return false;
    }
}

export { createPublication, getPublication, getPublicationByUser, getPublications, deletePublicationByUser }
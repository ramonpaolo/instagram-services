export default interface IUser {
    _id: string;
    name: string;
    'token-notification': string;
    followers: Array<string>;
    following: Array<string>;
    email: string;
    'verified-email': boolean;
    password: string;
}
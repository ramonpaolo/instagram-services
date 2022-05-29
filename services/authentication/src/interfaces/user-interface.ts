export default interface IUser {
    name: string;
    'token-notification': string;
    followers: Array<string>;
    _id: number;
}
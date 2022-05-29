declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;

            PASSWORD_MONGO: string;
            USERNAME_MONGO: string;

            HOST_RABBITMQ: string
            USER_RABBITMQ: string
            PASSWORD_RABBITMQ: string
            PORT_RABBITMQ: number
            URL_RABBITMQ: string
        }
    }
}
export { }
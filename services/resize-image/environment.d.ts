declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;

            ACCESS_KEY_ID: string;
            SECRET_ACCESS_KEY: string;
            REGION: string;
            BUCKET: string;

            HOST_RABBITMQ: string
            USER_RABBITMQ: string
            PASSWORD_RABBITMQ: string
            PORT_RABBITMQ: number
            URL_RABBITMQ: string
        }
    }
}
export { }

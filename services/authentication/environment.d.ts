declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;

            PASSWORD_MONGO: string;
            USERNAME_MONGO: string;

            HOST_RABBITMQ: string;
            USER_RABBITMQ: string;
            PASSWORD_RABBITMQ: string;
            PORT_RABBITMQ: number;
            URL_RABBITMQ: string;

            HOST_NODEMAILER: string;
            USER_NODEMAILER: string;
            PASS_NODEMAILER: string;

            ACCESS_KEY_ID: string;
            SECRET_ACCESS_KEY: string;
            REGION: string;
            BUCKET: string;
        }
    }
}
export { }

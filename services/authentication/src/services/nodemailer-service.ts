import mailer from 'nodemailer'
import dotenv from 'dotenv'

export default class NodeMailer {
    private transporter: mailer.Transporter | undefined;

    constructor() {
        dotenv.config()
        this.transporter = mailer.createTransport({
            host: String(process.env.HOST_NODEMAILER),
            port: 465,
            secure: true,
            auth: {
                user: String(process.env.USER_NODEMAILER),
                pass: String(process.env.PASS_NODEMAILER),
            },
        })
    }

    async sendEmail(email: string, name: string, _id: string) {
        const info = await this.transporter?.sendMail({
            from: String(process.env.USER_NODEMAILER), // sender address
            to: email, // list of receivers
            subject: 'Hello ✔', // Subject line
            html: `
            <html>
                <body>
                    Olá <strong>${name.split(' ').shift()}</strong>, como vai?
                    <br/>
                    Para confirmar esse email, basta clicar <a href='https://localhost:3000/user/verify/${_id}'>aqui</a>
                </body>
            </html>`, // html body
        });
        console.log(info)
    }

}



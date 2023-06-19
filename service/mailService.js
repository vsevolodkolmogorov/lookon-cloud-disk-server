const nodemailer = require("nodemailer");

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

    }

    async sendActivationMail(to, link)  {
        await this.transporter.sendMail({
            from: process.env.EMAIL,
            to: to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        });
    }

    async sendCheckMail(to, namesOfMerchandises, price, sizes)  {
        await this.transporter.sendMail({
            from: process.env.EMAIL,
            to: to,
            subject: 'Ваш чек',
            text: '',
            html:   `
                     <div>
                        <div className={"merchandiseContent d-flex justify-content-center align-items-center"}>
                            <div>
                                <p>Спасибо за покупку!</p>
                            </div>
                            <div>
                                <p>Товары: ${namesOfMerchandises}</p>
                            </div>
                            <div>
                                <p>Размеры: ${sizes}</p>
                            </div>
                            <div>
                                <p>Общая стоимость: ${price}</p>
                            </div>
                        </div>
                    </div>
                    `
        });
    }
}

module.exports = new MailService();
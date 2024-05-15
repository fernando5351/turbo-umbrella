const nodemailer = require('nodemailer');
const { mail } = require('../../../config')
const boom = require('@hapi/boom');

class  EmailController {

    async sendMail(user,subject,body){
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth:{
                user: mail.mail,
                pass: mail.password
            }
        });

        const mailOption = {
            from: mail.mail,
            to: user.email,
            subject,
            html: body
        }

        return new Promise((resolve,reject)=>{
            transporter.sendMail(mailOption,(error,info)=>{
                if (error) {
                    reject(boom.badRequest(error))
                }else{
                    resolve(info)
                }
            });
        });
    }

    

}

module.exports = EmailController;

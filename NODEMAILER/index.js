const nodeMailer = require("nodemailer")
require("dotenv").config()
const { GMAIL_USER_EMAIL, GMAIL_APP_PASS } = process.env

const html = `
    <h3>Hello NodeMailer!</h3>
    <p>How you doing??</p>
    <img src="cid:${GMAIL_USER_EMAIL}" width="400" >
`

// three ways to create transporter to sent emails
const Transporter1 = {
    service: 'gmail',
    auth: {
        user: GMAIL_USER_EMAIL,
        pass: GMAIL_APP_PASS
    }
}

const Transporter2 = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: GMAIL_USER_EMAIL,
        pass: GMAIL_APP_PASS
    }
}

const Transporter3 = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: GMAIL_USER_EMAIL,
        pass: GMAIL_APP_PASS
    }
}

const emails = ['test1@gmail.com', 'test2@gmail.com']

async function main() {
    const transporter = nodeMailer.createTransport(Transporter3)
    const info = await transporter.sendMail({
        from: `Verma <${GMAIL_USER_EMAIL}>`,
        to: 'test1@gmail.com',
        // to: emails, // multiple emails
        subject: 'Emails with attachments and embedded images',
        html: html,
        attachments: [{
            filename: 'img-1.jpg',
            path: './images/img-1.jpg',
            cid: GMAIL_USER_EMAIL // Send embedded images -- add in html content
        },
        {
            filename: 'img-2.jpg',
            path: './images/img-2.jpg' // Send images as attachements
        }]
    })
    console.log("Message info: ", info);
    console.log("Message sent: ", info.messageId);
    console.log(info.accepted);
    console.log(info.rejected)

}

main().catch(e => console.log(e))

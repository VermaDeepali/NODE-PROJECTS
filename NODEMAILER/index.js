const nodeMailer = require("nodemailer")
require("dotenv").config()
const {GMAIL_USER_EMAIL, GMAIL_APP_PASS} = process.env

const html = `
    <h1>Hello NodeMailer!</h1>
    <p>How you doing??</p>
`
async function main() {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_USER_EMAIL,
            pass: GMAIL_APP_PASS
        }
    })
    const info = await transporter.sendMail({
        from: `Verma <${GMAIL_USER_EMAIL}>`,
        to: 'test1@mail.com',
        subject: 'Test 1',
        html: html 
    })

    console.log("Message sent: ", info.messageId)
}

main().catch(e => console.log(e))

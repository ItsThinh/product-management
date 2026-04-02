const nodeMailer = require('nodemailer');

module.exports.sendMail = (email, subject, html) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOption = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOption, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    })
}
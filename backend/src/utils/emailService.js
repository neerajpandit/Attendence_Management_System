// import nodemailer from 'nodemailer';

// const sendMail = async (to, subject, text) => {
//   const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//       },
//       tls: {
//           rejectUnauthorized: false, // <-- bypass self-signed cert error
//       },
//   });
//   console.log("hii")
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send email');
//   }
// };

// export default sendMail;



import nodemailer from "nodemailer";

const sendMail = async (to, subject, html) => {
  console.log("Sending email to:", to, "Subject:", subject, "HTML content provided", html);
  
    const { ZEPTOMAIL_USER, ZEPTOMAIL_PASS, MAIL_NAME, MAIL_EMAIL } = process.env;
    if (!ZEPTOMAIL_USER || !ZEPTOMAIL_PASS || !MAIL_NAME || !MAIL_EMAIL) {
        console.error("Missing Zoho Mail configuration in environment variables");
        return false;
    }
    const transporter = nodemailer.createTransport({
        host: "smtp.zeptomail.in",
        port: 465,
        secure: true,
        auth: {
            user: ZEPTOMAIL_USER,
            pass: ZEPTOMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false, // <-- bypass self-signed cert error
        },
    });
    const mailOptions = {
        from: `"${MAIL_NAME}" <${MAIL_EMAIL}>`,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email with Zoho:", error);
        return false;
    }
};

export default sendMail;

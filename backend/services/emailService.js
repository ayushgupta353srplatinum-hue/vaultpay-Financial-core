const nodemailer = require("nodemailer");

const sendEmail = async (
   to,
   pdfPath
) => {

   const transporter =
      nodemailer.createTransport({

         service: "gmail",

         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
         },
      });

   const mailOptions = {

      from: process.env.EMAIL_USER,

      to,

      subject:
         "Payment Receipt - VaultPay",

      text:
         "Your payment was successful. Receipt attached.",

      attachments: [
         {
            filename: "receipt.pdf",
            path: pdfPath,
         },
      ],
   };

   await transporter.sendMail(
      mailOptions
   );

   console.log("Receipt Email Sent");
};

module.exports = sendEmail;
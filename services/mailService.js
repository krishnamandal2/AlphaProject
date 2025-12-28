const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Gmail App Password
  },
});

exports.sendGreetingMail = async (to, pdfBuffer) => {
  await transporter.sendMail({
    from: `"New Year Greetings 🎉" <${process.env.MAIL_USER}>`,
    to,
    subject: "🎉 Your New Year Greeting Card",
    text: "Wishing you a joyful and successful New Year!",
    attachments: [
      {
        filename: "NewYear2026.pdf",
        content: pdfBuffer,          // ✅ BUFFER
        contentType: "application/pdf",
      },
    ],
  });
};
  
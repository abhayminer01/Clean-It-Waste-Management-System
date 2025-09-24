const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Admin Panel" <${testAccount.user}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent successfully to", to);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = sendMail;

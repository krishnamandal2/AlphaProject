const cron = require("node-cron");
const userModel = require("../models/usermodels");
const { buildUserPDF } = require("../services/pdfService");
const { sendGreetingMail } = require("../services/mailService");

cron.schedule("*/1 * * * *", async () => {
  console.log("⏰ Cron running: Checking pending emails");

  try {
    const users = await userModel.getPendingEmailUsers();

    for (const user of users) {
      try {
        const pdfBuffer = await buildUserPDF(user);

        await sendGreetingMail(
          user.email,
          pdfBuffer,
          `${user.name.replace(/\s+/g, "_")}_New_Year_2026.pdf`
        );

        await userModel.markEmailSent(user.id);

        console.log("✅ Email sent to:", user.email);

      } catch (err) {
        console.error("❌ Email failed:", user.email, err);
      }
    }
  } catch (err) {
    console.error("❌ Cron error:", err);
  }
});

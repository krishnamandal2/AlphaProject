// const cron = require("node-cron");
// const userModel = require("../models/usermodels");
// const { createUserGreetingPDF } = require("../services/pdfService");
// const { sendGreetingMail } = require("../services/mailService");

// cron.schedule("*/5 * * * *", async () => {
//   console.log("📨 Checking users for greeting PDF...");

//   const users = await userModel.getUsersWithoutGreeting();

//   for (const user of users) {
//     try {
//       const pdfPath = await createUserGreetingPDF(user);
//       await sendGreetingMail(user.email, pdfPath);
//       await userModel.markGreetingSent(user.id);
//       console.log(`✅ Sent greeting to ${user.email}`);
//     } catch (err) {
//       console.error("❌ Failed for user:", user.email, err);
//     }
//   }
// });

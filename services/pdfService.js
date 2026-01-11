const PDFDocument = require("pdfkit");
const https = require("https");
const { getNewYearMessage } = require("../helpers/messageHelper");

/**
 * Download Cloudinary image and return Buffer
 */
const getImageBuffer = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];

      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
};

exports.buildUserPDF = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: [595, 842], margin: 0 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const message = getNewYearMessage(user.name);

      /* ===== BACKGROUND ===== */
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#1a0000");

      /* ===== CARD ===== */
      const cardX = 40;
      const cardY = 40;
      const cardWidth = doc.page.width - 80;
      const cardHeight = doc.page.height - 80;

      doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 20).fill("#ffe6e6");
      doc
        .lineWidth(3)
        .strokeColor("#FF9F1C")
        .roundedRect(cardX, cardY, cardWidth, cardHeight, 20)
        .stroke();

      /* ===== TITLE ===== */
      doc
        .fillColor("#ff3333")
        .fontSize(34)
        .text("Happy New Year 2026", cardX, 90, {
          width: cardWidth,
          align: "center",
        });

      /* ===== USER IMAGE (CLOUDINARY) ===== */
      if (user.image) {
        try {
          const imageBuffer = await getImageBuffer(user.image);

          doc.save();
          doc.circle(297, 240, 60).clip();
          doc.image(imageBuffer, 237, 180, {
            width: 120,
            height: 120,
          });
          doc.restore();

          doc
            .circle(297, 240, 60)
            .lineWidth(4)
            .stroke("#FF6F00");
        } catch (imgErr) {
          console.error("Image load failed:", imgErr.message);
        }
      }

      /* ===== MESSAGE ===== */
      doc
        .fillColor("#333")
        .fontSize(16)
        .text(message, 100, 330, {
          width: doc.page.width - 200,
          align: "center",
          lineGap: 6,
        });

      /* ===== QUOTE ===== */
      doc
        .moveDown(1)
        .font("Helvetica-Bold")
        .fontSize(16)
        .text(
          `"Tomorrow is the first blank page of a 365-page book. Write a good one."`,
          {
            width: doc.page.width - 200,
            align: "center",
          }
        );

      doc
        .moveDown(1)
        .font("Helvetica")
        .fontSize(16)
        .text("Happy New Year!", {
          width: doc.page.width - 200,
          align: "center",
        });

      /* ===== FOOTER ===== */
      doc.moveDown(2);

      const footerY = doc.y + 40;

      doc
        .fontSize(12)
        .fillColor("#999")
        .text("— From Krishna", 100, footerY, {
          width: doc.page.width - 200,
          align: "center",
        });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

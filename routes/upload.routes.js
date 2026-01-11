const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    success: true,
    imageUrl: req.file.path,     // Cloudinary image URL
  });
});

module.exports = router;

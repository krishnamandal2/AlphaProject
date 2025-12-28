const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontrollers");
const upload = require("../middleware/upload"); // multer
const authmiddleware=require("../middleware/authmiddleware")
const roleMiddleware =require("../middleware/rolemiddleware")
// const { loginLimiter, refreshLimiter} = require("../middleware/rateLimiter");






//create
router.post("/signup", upload.single("image"), authController.signup);

//get
router.get("/users", authmiddleware,
  roleMiddleware("admin"),authController.getAllUsers);


  
//userdash data get

router.get("/userdash", authmiddleware, roleMiddleware("user"), authController.getUserDashboard);


//get by id
router.get("/usergetbyid/:id", authController.getUserById);


router.post("/login",authController.login);

router.post("/refresh-token", authController.refreshToken);

router.post("/logout", authController.logout);

//pdf
router.get("/user/:id/pdf", authmiddleware, roleMiddleware("admin"), authController.generateUserPDF);




//update users

router.post(
  "/userupdate/:id",
  upload.single("image"),
  authController.updateAllusers
);




module.exports = router;


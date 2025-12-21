const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontrollers");
const upload = require("../middleware/upload"); // multer
const authmiddleware=require("../middleware/authmiddleware")
const roleMiddleware =require("../middleware/rolemiddleware")


//create
router.post("/signup", upload.single("image"), authController.signup);

//get
router.get("/users", authmiddleware,
  roleMiddleware("admin"),authController.getAllUsers);


  
//userdash data get

router.get("/userdash", authmiddleware, roleMiddleware("user"), authController.getUserDashboard);


//get by id
router.get("/usergetbyid/:id", authController.getUserById);



//update users
router.post(
  "/userupdate/:id",
  upload.single("image"),
  authController.updateAllusers
);
router.post("/login", authController.login);



module.exports = router;


const bcrypt = require("bcrypt");
const userModel = require("../models/usermodels");
const jwt = require("jsonwebtoken");
// const path = require("path");
// const fs = require("fs");
// const PDFDocument = require("pdfkit");
 const { getNewYearMessage } = require("../helpers/messageHelper");

const { buildUserPDF } = require("../services/pdfService");
const { sendGreetingMail } = require("../services/mailService");



// exports.signup = async (req, res) => {

  
//   try {
//     const { name, email, mobile, password } = req.body;

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10); // 10 sal round

//     // image from multer
//     const image = req.file ? req.file.filename : null;

//     // call model
//     await userModel.createUser({
//       name,
//       email,
//       mobile,
//       image,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Signup failed",
//     });
//   }
// };

// get users



// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await userModel.getuser();  // wait for DB result
//     res.json(users);                           // send result to client
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching users" });
//   }
// };

////////user with pagination

// exports.getAllUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;

//     const users = await userModel.getUsersPaginated(page, limit);
//     const total = await userModel.getUsersCount();

   
//     res.json({
//       data: users,
//       pagination: {
//         page,
//         limit,
//         totalUsers: total,
//         totalPages: Math.ceil(total / limit)
//       }
//     });

//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };

 ////pagination with searching




 exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const image = req.file ? req.file.filename : null;

    // ✅ create user
    const result = await userModel.createUser({
      name,
      email,
      mobile,
      image,
      password: hashedPassword,
      email_sent: 0
    });

    // respond immediately (DO NOT WAIT FOR EMAIL)
    res.status(201).json({
      message: "User registered successfully"
    }); 

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Signup failed"
    });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const users = await userModel.getUsersPaginated(page, limit, search);
    const total = await userModel.getUsersCount(search);

    res.json({
      pagination: {
        page,
        limit,
        totalUsers: total,
        totalPages: Math.ceil(total / limit)
      },
      data: users
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};




// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await userModel.getuser();  // fetch users from DB

//     res.status(200).json({
//       message: "Users fetched successfully",  // custom message
//       data: users                             // actual users
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch users",
//       error: error.message                    // optional error info
//     });
//   }
// };

//upadteusers

// exports.updateAllusers=async(req,res)=>{


//   try{
//     const id=req.params.id
//     const { name, email, mobile } = req.body;
//      const image = req.file ? `/uploads/${req.file.filename}` : null;

//      const result= await userModel.updateusers({
//       id,
//       name,
//       email,
//       mobile,
//       image  
//     });

//   //  res.status(201).json({
//   //     message: "User registered successfully",
//   //   });

//   if(result.affectedRows === 0){  //affectedRows is sql property

//      return res.status(404).json({ msg: "User not found" });

//   }
//    res.json({
//       msg: "User updated successfully",
//       data: result
//     });

//   }catch(err){

//     console.log(err)
//       res.status(500).json({
//       message: "Signup failed",
//     });

//   }
// }


// //user get by id

// exports.getUserById = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const result = await userModel.getUserById(id);

//     if (result.length === 0) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     res.json({
//       userdata: result
//     });

//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err });
//   }
// };


// 🔹 Get user by ID (CONTROLLER)
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id; // from URL

    const result = await userModel.getUserById(id);

    if (result.length === 0) {
      return res.status(404).json({
        msg: "User not found",
       
      });
    }
 
    const user = result[0];
    const message = getNewYearMessage(user.name); // use helper
    res.json({
      userdata: result,
      message

    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server error"
    });
  }
};


///////Update user  with image
exports.updateAllusers = async (req, res) => {
  try {
    const id = req.params.id;

    const { name, email, mobile } = req.body;

    // 👇 If image uploaded
    let image = req.file ? req.file.filename : null;

    // 👇 Get old image if no new image
    if (!image) {
      const oldUser = await userModel.getUserById(id);
      if (oldUser.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }
      image = oldUser[0].image;
    }

    await userModel.updateusers(id, {
      name,
      email,
      mobile,
      image
    });

    res.json({ msg: "User updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed" });
  }
};




// authcontrollers.js for userdashbord fetch data by email

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.getUserById(userId);

    res.json({
      user: user[0]
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to load dashboard" });
  }
};






///Login usres



exports.login = async (req, res) => {
  const { email, password, accessNumber, accessToken } = req.body;

  try {
    const users = await userModel.getUserByEmail(email);
    if (users.length === 0) {
      return res.status(401).json({ msg: "Invalid email" });
    }

    const user = users[0];

    // 🔐 password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    // 🔑 role logic
    let role;
    if (accessToken === "8888") role = "admin";
    else if (accessNumber === "1234") role = "user";
    else return res.status(403).json({ msg: "Invalid access credentials" });

    // 🔐 access token (SHORT)
    const accessTokenJwt = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // 🔄 refresh token (LONG)
    const refreshTokenJwt = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 HttpOnly cookies
    res.cookie("accessToken", accessTokenJwt, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshTokenJwt, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      msg: "Login successful",
      role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

///*******Refresh Token */


exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "No refresh token provided" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.json({ msg: "Access token refreshed" });

  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ msg: "Invalid refresh token" });
  }
};

///logout 

exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ msg: "Logged out successfully" });
};


exports.generateUserPDF = async (req, res) => {
  try {
    const userId = req.params.id;
    const users = await userModel.getUserById(userId);

    if (!users.length) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = users[0];

    // ✅ reuse SAME PDF
    const pdfBuffer = await buildUserPDF(user);

    const mode = req.query.mode === "download"
      ? "attachment"
      : "inline";

    const filename = `${user.name.replace(/\s+/g, "_")}_new_year_2026.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `${mode}; filename="${filename}"`
    );

    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
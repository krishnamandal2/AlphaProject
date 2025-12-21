const bcrypt = require("bcrypt");
const userModel = require("../models/usermodels");
const jwt = require("jsonwebtoken");


exports.signup = async (req, res) => {
  
  try {
    const { name, email, mobile, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 sal round

    // image from multer
    const image = req.file ? req.file.filename : null;

    // call model
    await userModel.createUser({
      name,
      email,
      mobile,
      image,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Signup failed",
    });
  }
};

// get users



// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await userModel.getuser();  // wait for DB result
//     res.json(users);                           // send result to client
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching users" });
//   }
// };

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getuser();  // fetch users from DB

    res.status(200).json({
      message: "Users fetched successfully",  // custom message
      data: users                             // actual users
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message                    // optional error info
    });
  }
};

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
        msg: "User not found"
      });
    }

    res.json({
      userdata: result
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

    // 🔐 password compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    // 🔑 ROLE LOGIC (VERY IMPORTANT)
    let role;

    if (accessToken === "8888") {
      role = "admin";
    } else if (accessNumber === "1234") {
      role = "user";
    } else {
      return res.status(403).json({ msg: "Invalid access credentials" });
    }

    // 🔐 create token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      msg: "Login success",
      token,
      role
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

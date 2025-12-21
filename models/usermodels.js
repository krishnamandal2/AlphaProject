const db= require("../config/db")

//for user creates
exports.createUser = (data) => {
  const { name, email, mobile, image, password } = data;
//Using a Promise allows you to use async/await in your controller instead of nested callbacks
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (name, email, mobile, image, password) VALUES (?, ?, ?, ?, ?)",
      [name, email, mobile, image, password],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );  
  });
};


//For users get

//const users = await userModel.getuser(); for controllers

/*alter NOt work because model never use req,res

exports.getuser=()=>{
  db.query(
  "selet*from users",
      (err,result)=>{
        if(err){
        res.send("error")
        }else{
          res.send(result)
        }
        })

  }

*/

exports.getuser=()=>{ 

  return new Promise((resolve,reject)=>{
    db.query(
      "select*from users",
      (err,result)=>{

        if(err) reject(err);
        else resolve(result)
      }
    )
  })
   
}

//update users

exports.updateusers = (id, data) => {
  const { name, email, mobile, image } = data;

  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET name=?, email=?, mobile=?, image=? WHERE id=?",
      [name, email, mobile, image, id],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


///user get by id
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result); // array of user data
        }
      }
    );
  });
};



// // // 🔹 Get user by ID
// exports.getUserById = (id) => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       "SELECT * FROM users WHERE id = ?",
//       [id],
//       (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result); // returns array
//         }
//       }
//     );
//   });
// };

//get users by email

exports.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result); // returns array of users (usually one user)
        }
      }
    );
  });
};



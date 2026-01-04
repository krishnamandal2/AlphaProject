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

// exports.getuser=()=>{ 

//   return new Promise((resolve,reject)=>{
//     db.query(
//       "select*from users",
//       (err,result)=>{

//         if(err) reject(err);
//         else resolve(result)
//       }
//     )
//   })
   
// }

//for pagination

// exports.getUsersPaginated = (page, limit) => {
//   const offset = (page - 1) * limit;

//   return new Promise((resolve, reject) => {
//     db.query(
//       `SELECT id, name, email, mobile, image 
//        FROM users 
//        LIMIT ? OFFSET ?`,
//       [limit, offset],
//       (err, result) => {
//         if (err) reject(err);
//         else resolve(result);
//       }
//     );
//   });
// };


// exports.getUsersCount = () => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       "SELECT COUNT(*) AS total FROM users",
//       (err, result) => {
//         if (err) reject(err);
//         else resolve(result[0].total);
//       }
//     );
//   });
// };

///////////pagination+searching
exports.getUsersPaginated = (page, limit, search) => {
  const offset = (page - 1) * limit;

  let query = `
    SELECT id, name, email, mobile, image
    FROM users
  `;
  let values = [];

  if (search) {
    query += `
      WHERE name LIKE ?
         OR email LIKE ?
         OR mobile LIKE ?
    `;
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ` LIMIT ? OFFSET ?`;
  values.push(limit, offset);

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};



exports.getUsersCount = (search) => {
  let query = `SELECT COUNT(*) AS total FROM users`;
  let values = [];

  if (search) {
    query += `
      WHERE name LIKE ?
         OR email LIKE ?
         OR mobile LIKE ?
    `;
    values.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) reject(err);
      else resolve(result[0].total);
    });
  });
};






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


//user get by id

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

//////for cron job

exports.getPendingEmailUsers = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE email_sent = 0", 
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
};

exports.markEmailSent = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET email_sent = 1 WHERE id = ?",
      [id],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


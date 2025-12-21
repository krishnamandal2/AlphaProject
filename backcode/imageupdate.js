// exports.updateusers = (data) => {
//   const { id, name, email, mobile, image } = data;

//   return new Promise((resolve, reject) => {
//     let sql, values;

//     if (image) {
//       sql = "UPDATE users SET name=?, email=?, mobile=?, image=? WHERE id=?";
//       values = [name, email, mobile, image, id];
//     } else {
//       sql = "UPDATE users SET name=?, email=?, mobile=? WHERE id=?";
//       values = [name, email, mobile, id];
//     }

//     db.query(sql, values, (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

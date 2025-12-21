// <!-- <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>UserData</title>
// </head>
// <body>
//     <label>Search:</label>
//     <input type="text" id="search" placeholder="Search by name or email">
//     <br><br>

//     <table border="1">
//         <thead>
//             <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Mobile</th>
//                 <th>Password</th>
//                 <th>Action</th>
//             </tr>
//         </thead>
//         <tbody></tbody>
//     </table>

// <script>
// const tbody = document.querySelector("tbody");
// const searchInput = document.getElementById("search");

// // Fetch users from server with optional search query
// async function getUsers(searchTerm = "") {
//     const response = await fetch(`/usergets?search=${encodeURIComponent(searchTerm)}`);
//     const data = await response.json();
//     renderTable(data.userdata);
// }

// // Render table rows
// function renderTable(users) {
//     tbody.innerHTML = ""; // clear table

//     users.forEach(user => {
//         const tr = document.createElement("tr");
//         tr.innerHTML = `
//             <td>${user.id}</td>
//             <td>${user.name}</td>
//             <td>${user.email}</td>
//             <td>${user.mobile}</td>
//             <td>${user.password}</td>
//             <td>
//                 <a href="updateuser.html?id=${user.id}">
//                     <button>Edit</button>
//                 </a>
//                 <button onclick="deleteUser(${user.id})">Delete</button>
//             </td>
//         `;
//         tbody.appendChild(tr);
//     });
// }

// // Delete user
// async function deleteUser(id) {
//     const res = await fetch(`/userdelete/${id}`, { method: "DELETE" });
//     const result = await res.json();

//     if (res.ok) {
//         alert(result.msg);
//         getUsers(searchInput.value.trim()); // refresh table with current search
//     } else {
//         alert(result.msg);
//     }
// }

// // Search as user types (server-side)
// let debounceTimer;
// searchInput.addEventListener("input", () => {
//     clearTimeout(debounceTimer); // prevent too many requests
//     debounceTimer = setTimeout(() => {
//         getUsers(searchInput.value.trim());
//     }, 300); // wait 300ms after typing stops
// });

// // Initial load
// getUsers();
// </script>
// </body>
// </html> 
 

//     AFTER TOKEN

// -->



// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>UserData</title>
// </head>
// <body>

//     <button onclick="logout()" style="float:right;">Logout</button>
//     <h2>User Data</h2>

//     <label>Search:</label>
//     <input type="text" id="search" placeholder="Search by name or email">
//     <br><br>

//     <table border="1">
//         <thead>
//             <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Mobile</th>
//                 <th>Password</th>
//                 <th>Action</th>
//             </tr>
//         </thead>
//         <tbody></tbody>
//     </table>

// <script>
// const tbody = document.querySelector("tbody");
// const searchInput = document.getElementById("search");

// // 👉 GET TOKEN
// const token = localStorage.getItem("token");

// // ❌ If not logged in, redirect to login page
// if (!token) {
//     alert("You must login first");
//     window.location.href = "login.html";
// }

// // Fetch users with search and token
// async function getUsers(searchTerm = "") {
//     const response = await fetch(`/usergets?search=${encodeURIComponent(searchTerm)}`, {
//         headers: {
//             "Authorization": "Bearer " + token   // 👈 mandatory
//         }
//     });

//     const data = await response.json();

//     // unauthorized check
//     if (data.msg === "Invalid token" || data.msg === "No token provided") {
//         alert("Session expired. Please login again.");
//         logout();
//         return;
//     }

//     renderTable(data.userdata);
// }

// // Render table rows
// function renderTable(users) {
//     tbody.innerHTML = ""; // clear table

//     users.forEach(user => {
//         const tr = document.createElement("tr");
//         tr.innerHTML = `
//             <td>${user.id}</td>
//             <td>${user.name}</td>
//             <td>${user.email}</td>
//             <td>${user.mobile}</td>
//             <td>${user.password}</td>
//             <td>
//                 <a href="updateuser.html?id=${user.id}">
//                     <button>Edit</button>
//                 </a>
//                 <button onclick="deleteUser(${user.id})">Delete</button>
//             </td>
//         `;
//         tbody.appendChild(tr);
//     });
// }

// // Delete user (with token)
// async function deleteUser(id) {
//     const res = await fetch(`/userdelete/${id}`, { 
//         method: "DELETE",
//         headers: {
//             "Authorization": "Bearer " + token
//         }
//     });

//     const result = await res.json();

//     if (res.ok) {
//         alert(result.msg);
//         getUsers(searchInput.value.trim());
//     } else {
//         alert(result.msg);
//     }
// }

// // Search debounce
// let debounceTimer;
// searchInput.addEventListener("input", () => {
//     clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => {
//         getUsers(searchInput.value.trim());
//     }, 300);
// });

// // Logout
// function logout() {
//     localStorage.removeItem("token");
//     window.location.href = "login.html";
// }

// // Initial load
// getUsers();
// </script>

// </body>
// </html>


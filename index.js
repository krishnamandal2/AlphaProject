
const express= require("express")
require("dotenv").config(); 
const db=require("./config/db")
const path= require("path")
const cookieParser = require("cookie-parser");





console.log("Auth route file path:", require.resolve("./routes/authRoutes"));


const authroute=require("./routes/authRoutes")
const app= express()
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());



app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "private")));


//Route → Controller → Model → DB



app.use("/api/auth", authroute);



app.listen(process.env.PORT,()=>{
    console.log("Server is Runnig at port",process.env.PORT)
})
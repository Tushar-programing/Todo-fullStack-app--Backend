import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
import { ApiError } from "./utils/apiError.js";
dotenv.config();

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js"
import todo from "./routes/todo.routes.js"
// console.log("app.js working");
app.use("/api/v1/users", userRouter)

app.use("/api/v1/todo", todo)

// app.use((err, req, res, next) => {
//     if (err instanceof ApiError) {
  
//       // console.log(err)
//       return res.status(err.statusCode).json({
//         statusCode: err.statusCode,
//         message: err.message,
//         success: false
  
//       });
//     }
//     // console.log(err)
//     return res.status(500).json({
//       success: false,
//       message: 'Something went wrong on the server',
//     });
//   });

export { app }
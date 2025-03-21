import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import dbConnection from "./database/dbConnection.js"
import{errorMiddleware} from "./middleware/error.js"
import messageRouter from "./router/messageRoute.js"
import userRouter from "./router/userRoute.js"
import timelineRouter from "./router/timelineRoute.js"
import softwareApplicationRoute from "./router/softwareApplicationRoute.js"
import skillRouter from "./router/skillRoute.js"
import projectRouter from "./router/projectRoute.js"
const app = express()

dotenv.config({
    path:"./config/config.env"
})

app.use(cors({
    origin:[process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods:["GET", "POST","DELETE","PUT"],
    credentials:true,
    allowedHeaders:'Content-Type, Authorization'
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir:"/tmp/",
}))
app.use("/api/v1/message", messageRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/timeline", timelineRouter)
app.use("/api/v1/softwareapplication", softwareApplicationRoute)
app.use("/api/v1/skill", skillRouter)
app.use("/api/v1/project", projectRouter)



dbConnection()

app.use(errorMiddleware)
export default app;
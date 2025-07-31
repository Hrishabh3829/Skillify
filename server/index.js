import express from "express";
import dotenv from "dotenv";
import connectDB from "./dataBase/dbConnect.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({});

const app = express();

const Port = process.env.PORT;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


//api's
app.use("/api/v1/user", userRoute)

app.get("/", (req, res) => {
    res.send("from backend");
});


app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
//call Database
connectDB();

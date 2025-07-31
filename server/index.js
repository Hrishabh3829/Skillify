import express from "express";
import dotenv from "dotenv";
import connectDB from "./dataBase/dbConnect.js";


dotenv.config({});

const app = express();

const Port = process.env.PORT;

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
//call Database
connectDB();

app.get("/", (req, res) => {
    res.send("from backend");
});
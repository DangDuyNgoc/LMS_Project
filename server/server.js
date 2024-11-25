import bodyParser from "body-parser";
import dotenv, { config } from "dotenv";

import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import courseRoute from "./routes/courseRoute.js";
import orderRoute from "./routes/orderRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import layoutRoute from "./routes/layoutRoute.js";
import analyticsRoute from './routes/analyticsRoute.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

connectDB();

const app = express();

app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("<h1>API Working</h1>");
});

app.use("/api/user", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/order", orderRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/layout", layoutRoute);
app.use("/api/analytics", analyticsRoute);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(
    `Server started on ${process.env.DEV_MODE} mode on port ${port}`.bgCyan
      .white
  );
});

import connection from "./database/connection.js";
import projectRouter from "./routes/album.js";
import fileRouter from "./routes/upload.js";
import userRouter from "./routes/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

async function start() {
  try {
    const { PORT } = process.env;
    const app = express();
    app.use(bodyParser.json());
    app.set("trust proxy", 1);
    app.use(cors());
    app.use(express.json());
    app.use(express.json({ limit: "100mb" }));
    app.use(express.urlencoded({ limit: "100mb", extended: true }));
    app.use(cookieParser());

    // Routes
    app.use("/api/v1/album", projectRouter);
    app.use("/api/v1/file", fileRouter);
    app.use("/api/v1/user", userRouter);

    app.get("/", (req, res) => {
      res.send("Welcome to backend web!");
    });

    // Start server
    connection
      .then(() =>
        app.listen(PORT, () => console.log(`server run on localhost:${PORT}`))
      )
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
}

start();

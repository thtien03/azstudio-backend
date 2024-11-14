import connection from "./database/connection.js";
import * as routes from "./router/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";

dotenv.config();

async function start() {
  try {
    const { PORT } = process.env;
    const app = express();
    // Setup Swagger
    const file = fs.readFileSync("./src/doc-swagger.yaml", "utf8");
    const swaggerDocument = YAML.parse(file);

    app.use(bodyParser.json());
    app.set("trust proxy", 1);
    app.use(cors());
    app.use(express.json());
    app.use(express.json({ limit: "100mb" }));
    app.use(express.urlencoded({ limit: "100mb", extended: true }));
    app.use(cookieParser());

    // Routes
    app.use("/api/v1/album", routes.albumRouter);
    app.use("/api/v1/file", routes.uploadRouter);
    app.use("/api/v1/user", routes.userRouter);
    app.use("/api/v1/category", routes.categoryRouter);
    app.use("/api/v1/product", routes.productRouter);
    app.use("/api/v1/service", routes.serviceRouter);
    app.use("/api/v1/appointment", routes.appointmentRouter);

    app.use(
      "/api/v1/swagger",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    app.get("/", (req, res) => {
      res.send("Welcome to backend web!");
    });

    // Start server
    connection
      .then(() => {
        try {
          app.listen(PORT, () => {
            console.log(`Server connected to http://localhost:${PORT}`);
          });
        } catch (error) {
          console.log("Cannot connect to the server");
        }
      })
      // .then(() =>
      //   app.listen(PORT, () => console.log(`server run on localhost:${PORT}`))
      // )
      .catch((err) => {
        console.log("Invalid database connection...!", err);
      });
  } catch (error) {
    console.log(error);
  }
}

start();

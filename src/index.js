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
import { Server } from "socket.io";
import http from "http";
import vnpayRouter from "./router/vnpay.router.js";
import discountRouter from "./router/discount.routes.js";

dotenv.config();

async function startServer() {
  try {
    const { PORT, CLIENT_URL } = process.env;
    const app = express();
    const server = http.createServer(app);

    // Setup Swagger
    const swaggerFile = "./src/doc-swagger.yaml";
    if (fs.existsSync(swaggerFile)) {
      const fileContent = fs.readFileSync(swaggerFile, "utf8");
      const swaggerDocument = YAML.parse(fileContent);
      app.use(
        "/api/v1/swagger",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument)
      );
    } else {
      console.warn("Swagger file not found, skipping Swagger setup.");
    }

    // Middleware
    app.use(bodyParser.json());
    app.set("trust proxy", 1);
    app.use(
      cors({
        origin: CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ limit: "10mb", extended: true }));
    app.use(cookieParser());

    // Routes
    app.use("/api/v1/album", routes.albumRouter);
    app.use("/api/v1/file", routes.uploadRouter);
    app.use("/api/v1/user", routes.userRouter);
    app.use("/api/v1/category", routes.categoryRouter);
    app.use("/api/v1/product", routes.productRouter);
    app.use("/api/v1/service", routes.serviceRouter);
    app.use("/api/v1/appointment", routes.appointmentRouter);
    app.use("/api/v1/vnpay", vnpayRouter);
    app.use("/api/v1/discounts", discountRouter);

    app.get("/", (req, res) => {
      res.send("Welcome to backend web!");
    });

    // Socket.IO Setup
    const io = new Server(server, {
      cors: {
        origin: CLIENT_URL || "*",
        methods: ["GET", "POST"],
      },
    });
    app.set("socketio", io);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error("Unexpected error:", err.message);
      res.status(500).json({ message: "Đã xảy ra lỗi trên server", error: err.message });
    });

    // Start the server
    server.listen(PORT || 8080, () => {
      console.log(`Server running at http://localhost:${PORT || 8080}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error.message);
  }
}

async function connectDatabase() {
  try {
    await connection;
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
}

// Start application
(async () => {
  await connectDatabase();
  await startServer();
})();

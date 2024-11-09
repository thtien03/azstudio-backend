import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DB } = process.env;

const connection = mongoose.connect(
  `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}/${MONGO_DB}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

export default connection;

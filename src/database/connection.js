import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DB, MONGO_DB_APP_NAME } =
  process.env;
// // console.log(
//   `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}/${MONGO_DB}`
// );
const connection = mongoose.connect(
  `mongodb://${MONGO_PATH}/${MONGO_DB}`
  // `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}/${MONGO_DB}`
);

export default connection;

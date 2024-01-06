import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

let conn;

function connectDb() {
  // Database connection
  try {
    mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
    });
  } catch (error) {
    console.log(error);
    return;
  }

  conn = mongoose.connection;
  conn.on("error", (err) => {
    console.log("Could not connect to mongo server!");
    console.log(err);
  });
  conn.once("open", () => {
    console.log("Database connected.");
  });
}
export { conn };
export default connectDb;

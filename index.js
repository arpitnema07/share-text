//Main
import express from "express";
import http from "http";
import connectDb from "./config/db.js";
import mongoose from "mongoose";
import Text from "./models/text.js";
import ErrorRes from "./models/error_res.js";
import path from "path";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({ origin: "*" }));
// Serve static files from the 'public' folder
// app.use(express.static(path.join(__dirname, "public")));

// // Route to handle requests to the root URL
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// Connection and Setting up environment
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
const server = http.createServer(app);
server.listen(port);
server.on("listening", onListening);

connectDb();

// Routes

app.post("/share", async (req, res) => {
  const { title, text, key } = req.body;

  if (
    title == null ||
    title == "" ||
    text == null ||
    text == "" ||
    key == null ||
    key == ""
  ) {
    return res.status(401).json(new ErrorRes("Details missing!"));
  }
  try {
    var _id = new mongoose.Types.ObjectId();
    const text_ = new Text({
      _id,
      title,
      text,
      key,
    });
    const response = await text_.save();
    console.log(response);
    return res.json({
      response: response,
      message: "Text added successfully...",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json(new ErrorRes("Something went wrong."));
  }
});

app.get("/share/:key", async (req, res) => {
  try {
    const key = req.params.key;

    // Find the text in MongoDB using the unique ID
    const text = await Text.findOne({ key: key });

    if (!text) {
      console.log(error);
      return res.status(404).json(new ErrorRes("Not Found!"));
    }

    // Return the text content
    res.json({
      response: text,
      message: "Text Found!",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json(new ErrorRes("Something went wrong."));
  }
});

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("App started. Listening on " + bind);
}

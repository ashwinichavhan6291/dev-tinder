const express = require("express");

const app = express();
const http=require("http");
const { connectDB } = require("./config/database");

const User = require("./models/user.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5175",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user.js");
const initializeSocket = require("./utils/socket.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


const server=http.createServer(app);
initializeSocket(server);


connectDB()
  .then(() => {
    console.log("database connected successfully..");
   server.listen(3000, (req, res) => {
      console.log("server is started 3000");
    });
  })
  .catch((err) => {
    console.error("database cannot be connected");
  });

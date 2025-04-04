const express = require("express");

const app = express();
const http=require("http");
const { connectDB } = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
// app.options("*",cors());
app.use(express.json());
app.use(cookieParser());
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user.js");
const initializeSocket = require("./utils/socket.js");
const chatRouter = require("./routes/chat.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/" , chatRouter);


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

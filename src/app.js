const express = require("express");

const app = express();
const { connectDB } = require("./config/database");

const User = require("./models/user.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });

    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(400).send("user not found");
    }
  } catch (err) {
    res.status(400).send("error");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();

    res.send(users);
  } catch (err) {
    res.status(400).send("erorr");
  }
});

app.get("/delete", async (req, res) => {
  const userId = req.body.userId;

  try {
    const users = await User.findByIdAndDelete(userId);
    // const users = await User.findOneAndDelete({ _id: userId });
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("erorr");
  }
});

app.get("/update/:userId", async (req, res) => {
  const userId = req.params?.userId;

  const data = req.body;
  console.log(data);
  try {
    const Allowed_Updates = ["about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      Allowed_Updates.includes(k)
    );
    if (!isUpdateAllowed) {
      res.status(400).send("update not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("skills cannot be more than 10 ");
    }

    const users = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("user updated");
  } catch (err) {
    res.status(400).send("update failed : " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database connected successfully..");
    app.listen(3000, (req, res) => {
      console.log("server is started");
    });
  })
  .catch((err) => {
    console.error("database cannot be connected");
  });

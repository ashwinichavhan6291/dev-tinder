const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
app.use(express.json());
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  // firstName: "shivay",
  // lastName: "mine",

  await user.save();
  res.send("user added");
  // res.send(req.body);
});

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
    res.status(400).send("eroor");
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

app.get("/update", async (req, res) => {
  const userId = req.body.userId;

  const data = req.body;
  console.log(data);
  const users = await User.findByIdAndUpdate(userId, data, {
    runValidators: true,
  });

  res.send("user updated");
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

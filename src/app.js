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

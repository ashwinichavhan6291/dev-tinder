const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
// console.log(__dirname);
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");

app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("user added");
  } catch (err) {
    res.status(400).send("user cannot add :" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("login successfull");
    } else {
      throw Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
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

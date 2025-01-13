const express = require("express");

const authRouter = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

const { validateSignUpData } = require("../utils/validation.js");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();

    const token = await savedUser.getJWT();

    // console.log(token);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({ message: "user added", data: savedUser });
  } catch (err) {
    res.status(400).send("user cannot add :");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      // console.log(token);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout successful");
});
module.exports = authRouter;

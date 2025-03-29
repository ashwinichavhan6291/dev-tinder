const express = require("express");

const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const { validateForgetPassword } = require("../utils/validation");
// const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).send("invalid edit request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    // res.send(`${loggedInUser.firstName}, your Profile Updated successfully`);
    res.json({
      message: `${loggedInUser.firstName}, your Profile Updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validateForgetPassword(req)) {
      throw new Error("invalid password edit request");
    }
    const loggedInUser = req.user;
    const updatedPassword = req.body.password;
    console.log(updatedPassword);
    const newPassword = await bcrypt.hash(updatedPassword, 10);
    console.log(newPassword);
    loggedInUser.password = newPassword;

    // console.log(newPassword1);
    await loggedInUser.save();
    res.send(`${loggedInUser.firstName}, your password Updated successfully`);
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});
module.exports = profileRouter;

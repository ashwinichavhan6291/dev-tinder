const express = require("express");

const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInuser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");
    // }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({ message: "data fetch successfully", data: connectionRequest });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInuser._id, status: "accepted" },
        { fromUserId: loggedInuser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInuser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;

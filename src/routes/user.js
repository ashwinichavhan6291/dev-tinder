const express = require("express");

const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const User_Safe_Data = "firstName lastName skills age gender about photourl";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInuser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photourl about");
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
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "about",
        "age",
        "gender",
        "photourl",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "about",
        "age",
        "gender",
        "photourl",
      ]);

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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    loggedInuser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInuser._id,
        },
        { toUserId: loggedInuser._id },
      ],
    }).select("fromUserId toUserId");

    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    // console.log(hideUserFromFeed);

    const users = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hideUserFromFeed) },
        },
        { _id: { $ne: loggedInuser._id } },
      ],
    })
      .select(User_Safe_Data)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;

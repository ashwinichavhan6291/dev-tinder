const express = require("express");

const app = express();
app.get("/user", (req, res) => {
  res.send("user data sent");
});

// app.get("/getUserData", (req, res) => {
//   throw new Error("jznmn");
// });
// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(500).send("something went wrong");
//   }
// });

app.get("/getUserData", (req, res) => {
  try {
    throw new error("jhzsk");
  } catch (err) {
    res.status(500).send("some error occur");
  }
});
app.listen(3000);

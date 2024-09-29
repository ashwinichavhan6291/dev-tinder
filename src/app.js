const express = require("express");

const app = express();
const { adminAuth } = require("./middlewares/auth");
// app.get("/user/:userId/:name", (req, res) => {
//   console.log(req.params);
// });
app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("All data sent");
});
app.get("/admin/ ", (req, res) => {
  res.send("All user deleted");
});

app.listen(3000);

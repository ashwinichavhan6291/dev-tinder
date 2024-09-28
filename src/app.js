const express = require("express");

const app = express();
app.use("/test/2", (req, res) => {
  res.send("test1");
});
app.get("/user", (req, res) => {
  res.send({ firstname: "ashwini", lastname: "chavhan" });
});

app.post("/user", (req, res) => {
  res.send("data is saved in user post");
});
app.delete("/user", (req, res) => {
  res.send("data is deleted successfully");
});

app.use("/", (req, res) => {
  res.send("home page");
});
app.listen(3000);

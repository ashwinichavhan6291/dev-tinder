const express = require("express");

const app = express();

app.get("/user/:userId/:name", (req, res) => {
  console.log(req.params);
});

app.listen(3000);

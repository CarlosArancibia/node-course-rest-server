require("dotenv").config();

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(process.env.PORT, () => {
  console.log(`run in port ${process.env.PORT}`);
});

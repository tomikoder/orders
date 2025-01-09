require("dotenv").config();
require("./Tools/webscraper");

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.get("/", (req, res) => {
  res.send("Witaj w mojej aplikacji!");
});

app.listen(options.PORT, () => {
  console.log(`Serwer działa na http://localhost:${process.env.PORT}`);
});

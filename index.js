require("dotenv").config();

require("./db.js");
const express = require("express");
const mongoose = require("mongoose");
const fetchData = require("./Tools/webscraper");

const app = express();

app.get("/", (req, res) => {
  res.send("Witaj w mojej aplikacji!");
});

app.listen(process.env.PORT, () => {
  console.log(`Serwer działa na http://localhost:${process.env.PORT}`);
});

fetchData();

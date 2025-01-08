const options = require("./options");
const express = require("express");

const { PORT } = require("./options");

const app = express();

app.get("/", (req, res) => {
  res.send("Witaj w mojej aplikacji!");
});

app.listen(options.PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});

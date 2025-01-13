require("dotenv").config();

const connectToDB = require("./db.js");
const express = require("express");
const downloadData = require("./Tools/webscraper");
const cron = require("node-cron");
const listHandler = require("./Handlers/App/listHandler.js");
const getHandler = require("./Handlers/App/getHandler.js");
const registerHandler = require("./Handlers/Auth/registerHandler.js");
const { validate } = require("./Middlewares/Auth/basicAuthMiddleware.js");
const bodyParser = require("body-parser");

const app = express();

async function startServer() {
  try {
    // Czekamy na połączenie z bazą danych
    await connectToDB();
    // Jeśli połączenie zakończy się sukcesem, uruchamiamy serwer
    app.get("/register", bodyParser.json(), registerHandler.register);

    app.use(validate);
    app.get("/list", listHandler.getData);
    app.get("/get/:id", getHandler.getData);

    app.listen(process.env.PORT, () => {
      console.log(`Serwer działa na http://localhost:${process.env.PORT}`);
    });

    cron.schedule("* * * * *", downloadData);
  } catch (error) {
    console.error("Błąd podczas inicjalizacji aplikacji:", error);
  }
}

// Rozpoczynamy aplikację
startServer();

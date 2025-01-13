require("dotenv").config();

const connectToDB = require("./db.js");
const express = require("express");
const downloadData = require("./Tools/webscraper");
const cron = require("node-cron");
const listHandler = require("./Handlers/App/listHandler.js");
const getHandler = require("./Handlers/App/getHandler.js");
const registerHandler = require("./Handlers/Auth/registerHandler.js");
const loginHandler = require("./Handlers/Auth/loginHandler.js");
const { validate } = require("./Middleware/Auth/basicAuthMiddleware.js");
const bodyParser = require("body-parser");

const app = express();

async function startServer() {
  try {
    // Czekamy na połączenie z bazą danych
    await connectToDB();
    // Jeśli połączenie zakończy się sukcesem, uruchamiamy serwer
    app.use(bodyParser.json());
    app.get("/register", registerHandler.register);
    app.get("/login", loginHandler.login);

    app.use(validate);
    app.get("/list", listHandler.getData);
    app.get("/get/:id", getHandler.getData);

    app.listen(process.env.PORT, () => {
      console.log(`Serwer działa na http://localhost:${process.env.PORT}`);
    });

    cron.schedule("0 16 * * *", downloadData);
  } catch (error) {
    console.error("Błąd podczas inicjalizacji aplikacji:", error);
  }
}

// Rozpoczynamy aplikację
startServer();

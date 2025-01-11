require("dotenv").config();

const connectToDB = require("./db.js");
const express = require("express");
const downloadData = require("./Tools/webscraper");
const cron = require("node-cron");
const listHandler = require("./Handlers/listHandler");
const getHandler = require("./Handlers/getHandler");

const app = express();

async function startServer() {
  try {
    // Czekamy na połączenie z bazą danych
    await connectToDB();

    // Jeśli połączenie zakończy się sukcesem, uruchamiamy serwer
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

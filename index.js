require("dotenv").config();

const connectToDB = require("./db.js");
const express = require("express");
const mongoose = require("mongoose");
const downloadData = require("./Tools/webscraper");

const app = express();

async function startServer() {
  try {
    // Czekamy na połączenie z bazą danych
    await connectToDB();

    // Jeśli połączenie zakończy się sukcesem, uruchamiamy serwer
    app.get("/", (req, res) => {
      res.send("Witaj w mojej aplikacji!");
    });

    app.listen(process.env.PORT, () => {
      console.log(`Serwer działa na http://localhost:${process.env.PORT}`);
    });

    downloadData();
  } catch (error) {
    console.error("Błąd podczas inicjalizacji aplikacji:", error);
  }
}

// Rozpoczynamy aplikację
startServer();

require("dotenv").config(); // Załaduj konfigurację z pliku .env
const mongoose = require("mongoose");

const db_address = `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`;

const connectToDB = async () => {
  try {
    await mongoose.connect(db_address);
    console.log("Połączono z MongoDB");
  } catch (err) {
    console.error("Błąd połączenia:", err);
    process.exit(1); // Zatrzymanie aplikacji w przypadku błędu połączenia
  }
};

module.exports = connectToDB;

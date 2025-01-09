const mongoose = require("mongoose");

const db_address = `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`;

const connectToDB = async () => {
  try {
    await mongoose.connect(db_address);
    console.log("Połączono z MongoDB");
  } catch (err) {
    console.error("Błąd połączenia:", err);
  }
};

connectToDB();

module.exports = { connectToDB };

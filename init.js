const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/orders_app");
    console.log("Połączono z MongoDB");
  } catch (err) {
    console.error("Błąd połączenia:", err);
  }
};

connectToDB();

// Importowanie modeli
const User = require("./models/User");
const Order = require("./models/Order");
const Product = require("./models/Product");
const Config = require("./models/Config");

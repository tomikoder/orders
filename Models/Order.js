const mongoose = require("mongoose");
const Product = require("./Product"); // Importowanie modelu produktu

const orderSchema = new mongoose.Schema({
  orderID: { type: String, required: true, unique: true },
  products: { type: [Product.schema], required: true }, // Używanie schemy produktu
  orderWorth: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => Number.isInteger(value * 100), // Walidacja liczby z dokładnością do dwóch miejsc po przecinku
      message: "Cena może mieć maksymalnie dwie liczby po przecinku",
    },
  },
});

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);

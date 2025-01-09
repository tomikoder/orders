const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productQuantity: {
    type: Number,
    required: true,
    min: [1, "Ilość musi być przynajmniej 1"],
  },
});

const orderSchema = new mongoose.Schema({
  orderID: { type: String, required: true, unique: true },
  products: { type: [productSchema], required: true }, // Używanie schemy produktu
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

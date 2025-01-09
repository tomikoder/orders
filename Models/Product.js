const mongoose = require("mongoose");

const productSchema =
  mongoose.models.Product ||
  mongoose.model(
    "Product",
    new mongoose.Schema({
      productId: { type: String, required: true },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Ilość musi być przynajmniej 1"],
      },
    })
  );

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);

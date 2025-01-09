const mongoose = require("mongoose");

const productSchema =
  mongoose.models.Config ||
  mongoose.model(
    "Config",
    new mongoose.Schema({
      last_update: { type: String },
    })
  );

module.exports =
  mongoose.models.Config || mongoose.model("Config", productSchema);

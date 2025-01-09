const mongoose = require("mongoose");

const user =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema({
      username: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    })
  );

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

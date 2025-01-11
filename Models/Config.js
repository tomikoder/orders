const mongoose = require("mongoose");

const productSchema =
  mongoose.models.Config ||
  mongoose.model(
    "Config",
    new mongoose.Schema({
      lastUpdate: { type: String },
    })
  );

const Config =
  mongoose.models.Config || mongoose.model("Config", productSchema);

async function getOrCreateConfig() {
  let record = await Config.findOne();

  if (!record) {
    record = new Config({ lastUpdate: "1970-01-01 00:00:00" }); // Unix Epoch
    await record.save();
  }
  return record;
}

module.exports = getOrCreateConfig;

const mongoose = require("mongoose");

const productSchema =
  mongoose.models.Config ||
  mongoose.model(
    "Config",
    new mongoose.Schema({
      last_update: { type: String },
    })
  );

const Config =
  mongoose.models.Config || mongoose.model("Config", productSchema);

async function getOrCreateRecord() {
  let record = await Config.findOne();

  if (!record) {
    record = new Config({ last_update: "1970-01-01 00:00:00" }); // Unix Epoch
    await record.save();
  }
  return record;
}

module.exports = getOrCreateRecord;

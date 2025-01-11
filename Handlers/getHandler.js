const mongoose = require("mongoose");
const Order = require("../Models/Order");

async function getData(req, res) {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Niepoprawny format ID" });
  }

  item = await Order.findById(id);
  if (!item) {
    return res
      .status(404)
      .json({ error: "Element o tym ID nie został znaleziony" });
  }
  res.json(item);
}

module.exports = {
  getData,
};

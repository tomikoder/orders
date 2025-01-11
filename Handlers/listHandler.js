const Order = require("../Models/Order");
const { Parser } = require("json2csv");

function formatToCSV(orders) {
  const flatOrders = [];
  orders.forEach((order) => {
    flatOrder = {};
    flatOrder.id = order.orderID;
    flatOrder.orderWorth = order.orderWorth;
    formatedProducts = [];
    order.products.forEach((product) => {
      formatedProducts.push(product.productId + "=" + product.productQuantity);
    });
    flatOrder.productsInfo = formatedProducts.join(";");
    flatOrders.push(flatOrder);
  });
  const parser = new Parser();
  return parser.parse(flatOrders);
}

function isValidPrice(price) {
  if (isNaN(price)) return false;
  if (Number(price) < 0) return false;
  const regex = /^\d+(\.\d{1,2})?$/; // Wyrażenie regularne: liczba z maks. 2 miejscami po przecinku
  if (!regex.test(price)) return false;
  return true;
}

function validateInput(minWorth, maxWorth) {
  function formatPrice(price) {
    return parseFloat(Number(price).toFixed(2)); // Konwersja na liczbę z dwoma miejscami po przecinku
  }
  let query = {};
  if (minWorth !== undefined && minWorth !== "") {
    if (isValidPrice(minWorth)) {
      query.$gte = formatPrice(minWorth);
    } else {
      return null;
    }
  }

  if (maxWorth !== undefined && maxWorth !== "") {
    if (isValidPrice(maxWorth)) {
      query.$lte = formatPrice(maxWorth);
    } else {
      return null;
    }
  }

  if ("$gte" in query && "$lte" in query) {
    if (query.$gte > query.$lte) {
      return null;
    }
  }

  return query;
}

async function getData(req, res) {
  const minWorth = req.query.minWorth; // Pobranie konkretnego parametru
  const maxWorth = req.query.maxWorth;
  const query = validateInput(minWorth, maxWorth);
  if (!query) {
    return res.status(405).json({ error: "Błędne query parameters." });
  }

  let orders;
  if (Object.getOwnPropertyNames(query).length > 0) {
    orders = await Order.find({
      orderWorth: query,
    });
  } else {
    orders = await Order.find();
  }

  const csv = formatToCSV(orders);
  res.header("Content-Type", "text/csv");
  res.attachment("orders.csv");
  res.send(csv);
}

module.exports = {
  getData,
};

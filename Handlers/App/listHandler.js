const Order = require("../../Models/Order");
const { Parser } = require("json2csv");

function formatPrice(price) {
  return parseFloat(Number(price).toFixed(2));
}

function isValidPrice(price) {
  if (isNaN(price) || Number(price) < 0) return false;
  const regex = /^\d+(\.\d{1,2})?$/; // Liczba z maks. 2 miejscami po przecinku
  return regex.test(price);
}

function getQuery(minWorth, maxWorth) {
  const parametersMap = {
    minWorth: "$gte",
    maxWorth: "$lte",
  };

  function validateInput(input, operator, query) {
    if (input === undefined || input === "") return true;
    if (isValidPrice(input)) {
      query[operator] = formatPrice(input);
      return true;
    }
    return false;
  }

  const query = {};
  if (
    !validateInput(minWorth, parametersMap.minWorth, query) ||
    !validateInput(maxWorth, parametersMap.maxWorth, query)
  ) {
    return null;
  }

  if (
    query.$gte !== undefined &&
    query.$lte !== undefined &&
    query.$gte > query.$lte
  ) {
    return null; // Minimalna wartość nie może być większa niż maksymalna
  }

  return query;
}

function formatToCSV(orders) {
  const flattenedOrders = orders.map((order) => ({
    id: order.orderID,
    orderWorth: order.orderWorth,
    productsInfo: order.products
      .map((product) => `${product.productId}=${product.productQuantity}`)
      .join(";"),
  }));

  const parser = new Parser();
  return parser.parse(flattenedOrders);
}

// Główna funkcja

async function getData(req, res) {
  try {
    const minWorth = req.query.minWorth;
    const maxWorth = req.query.maxWorth;
    const query = getQuery(minWorth, maxWorth);

    if (!query) {
      return res.status(400).json({ error: "Invalid query parameters." });
    }

    const orders = await Order.find(
      Object.keys(query).length ? { orderWorth: query } : {}
    );

    const csv = formatToCSV(orders);

    res.header("Content-Type", "text/csv");
    res.attachment("orders.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = {
  getData,
};

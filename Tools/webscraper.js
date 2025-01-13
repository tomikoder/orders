const Order = require("../Models/Order");
const getOrCreateConfig = require("../Models/Config");
const dayjs = require("dayjs");

const address = `https://${process.env.API_PANEL}/api/admin/v4/orders/orders/get`;

function getOptions(lastUpdate, count) {
  return {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "X-API-KEY": process.env.X_API_KEY,
    },
    body: JSON.stringify({
      params: {
        ordersStatuses: ["finished"],
        ordersRange: {
          ordersDateRange: {
            ordersDateType: "modified",
            ordersDateBegin: lastUpdate,
          },
        },
        resultsPage: count,
      },
    }),
  };
}

async function downloadData() {
  try {
    const config = await getOrCreateConfig();
    fetchData(config);
  } catch (error) {
    console.error("Błąd podczas pobierania rekordu:", error);
  }
}

function addSecond(dateString) {
  return dayjs(dateString).add(1, "second").format("YYYY-MM-DD HH:mm:ss");
}

async function fetchData(config) {
  try {
    let page = 0;
    let currLastDate = config.lastUpdate;
    let newLastDate;
    while (true) {
      options = getOptions(config.lastUpdate, page);
      const response = await fetch(address, options);
      const data = await response.json();
      if ("errors" in data && data.errors.faultCode === 2) {
        if (currLastDate != config.lastUpdate) {
          config.lastUpdate = addSecond(currLastDate);
          config.save();
        }
        return;
      }
      data.Results.sort(
        (a, b) =>
          new Date(a.orderDetails.orderChangeDate) -
          new Date(b.orderDetails.orderChangeDate)
      );
      lastIndex = data.Results.length - 1;
      newLastDate = data.Results[lastIndex].orderDetails.orderChangeDate;
      if (new Date(newLastDate) > new Date(currLastDate)) {
        currLastDate = newLastDate;
      }
      handle_data(data);
      page++;
    }
  } catch (err) {
    console.error("Błąd:");
  }
}

function calcFullCost(orderCurrency) {
  let orderCosts = [
    orderCurrency.orderProductsCost,
    orderCurrency.orderDeliveryCost,
    orderCurrency.orderPayformCost,
    orderCurrency.orderInsuranceCost,
  ];
  let total = orderCosts.reduce((accumulator, currentCost) => {
    return accumulator + currentCost;
  }, 0);
  return parseFloat(total.toFixed(2));
}

function handle_data(data) {
  let finalResult = [];
  data.Results.forEach((order) => {
    let formatedOrder = {};
    formatedOrder.orderID = order.orderId;
    products = [];
    if (
      "productsResults" in order.orderDetails &&
      order.orderDetails.productsResults.length
    ) {
      order.orderDetails.productsResults.forEach((product) => {
        products.push({
          productId: product.productId,
          productQuantity: product.productQuantity,
        });
      });
    }
    formatedOrder.products = products;
    formatedOrder.orderWorth = calcFullCost(
      order.orderDetails.payments.orderCurrency
    );
    finalResult.push(formatedOrder);
  });
  Order.insertMany(finalResult)
    .then(() => {
      console.log("Wstawiono zamówienie");
    })
    .catch((err) => {
      console.error("Błąd wstawiania zamówienia:", err);
    });
}

module.exports = downloadData;

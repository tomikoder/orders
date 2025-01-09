const axios = require("axios");
const cron = require("node-cron");
const mongoose = require("mongoose");
const Order = require("../Models/Order");
const Config = require("../Models/Config");

const options = {
  method: "POST",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    "X-API-KEY": process.env.X_API_KEY,
  },
  body: JSON.stringify({ params: { ordersStatuses: ["finished"] } }),
};

const address = `https://${process.env.API_PANEL}/api/admin/v4/orders/orders/get`;

async function fetchData() {
  try {
    const response = await fetch(address, options);
    const data = await response.json();
    handle_data(data);
    return data;
  } catch (err) {
    console.error("Błąd:", err);
  }
}

function calc_full_cost(orderCurrency) {
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
  let final_result = [];
  data.Results.forEach((order) => {
    formated_order = [];
    formated_order.orderID = order.orderId;
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
    formated_order.products = products;
    formated_order.orderWorth = calc_full_cost(
      order.orderDetails.payments.orderCurrency
    );

    final_result.push(formated_order);
  });
  console.log(final_result);
  Order.insertMany(final_result)
    .then((result) => {
      console.log("Wstawiono zamówienie", result);
    })
    .catch((err) => {
      console.error("Błąd wstawiania zamówienia:", err);
    });
}

module.exports = fetchData; // Eksportowanie funkcji

const axios = require("axios");
const cron = require("node-cron");
const mongoose = require("mongoose");
const Order = require("../Models/Order");
const getOrCreateRecord = require("../Models/Config");
const dayjs = require("dayjs");

const address = `https://${process.env.API_PANEL}/api/admin/v4/orders/orders/get`;

function getOptions(last_update, count) {
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
            ordersDateBegin: last_update,
          },
        },
        resultsPage: count,
      },
    }),
  };
}

async function downloadData() {
  try {
    const record = await getOrCreateRecord();
    fetchData(record);
  } catch (error) {
    console.error("Błąd podczas pobierania rekordu:", error);
  }
}

function addMinute(dateString) {
  return dayjs(dateString).add(1, "minute").format("YYYY-MM-DD HH:mm:ss");
}

async function fetchData(record) {
  try {
    let page = 0;
    let curr_last_date = record.last_update;
    let new_last_date;
    while (true) {
      options = getOptions(record.last_update, page);
      const response = await fetch(address, options);
      const data = await response.json();
      if ("errors" in data && data.errors.faultCode === 2) {
        if (curr_last_date != record.last_update) {
          record.last_update = addMinute(curr_last_date);
          record.save();
        }
        return;
      }
      data.Results.sort(
        (a, b) =>
          new Date(a.orderDetails.orderChangeDate) -
          new Date(b.orderDetails.orderChangeDate)
      );
      last_index = data.Results.length - 1;
      new_last_date = data.Results[last_index].orderDetails.orderChangeDate;
      if (new Date(new_last_date) > new Date(curr_last_date)) {
        curr_last_date = new_last_date;
      }
      handle_data(data);
      page++;
    }
  } catch (err) {
    console.error("Błąd:");
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
  Order.insertMany(final_result)
    .then(() => {
      console.log("Wstawiono zamówienie");
    })
    .catch((err) => {
      console.error("Błąd wstawiania zamówienia:", err);
    });
}

module.exports = downloadData;

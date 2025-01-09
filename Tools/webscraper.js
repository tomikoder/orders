const axios = require("axios");
const cron = require("node-cron");
const mongoose = require("mongoose");
const Product = require("../Models/Product");

const options = {
  method: "POST",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    "X-API-KEY":
      "YXBwbGljYXRpb24xNjpYeHI1K0MrNVRaOXBaY2lEcnpiQzBETUZROUxrRzFFYXZuMkx2L0RHRXZRdXNkcmF5R0Y3ZnhDMW1nejlmVmZP",
  },
  body: JSON.stringify({ params: { ordersStatuses: ["finished"] } }),
};

async function fetchData() {
  try {
    const response = await fetch(
      "https://zooart6.yourtechnicaldomain.com/api/admin/v4/orders/orders/get",
      options
    );
    const data = await response.json();
    //show(data);
    return data;
  } catch (err) {
    console.error("Błąd:", err);
  }
}

function show(data) {
  console.log(data);
}

module.exports = fetchData; // Eksportowanie funkcji

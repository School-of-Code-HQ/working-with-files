const fs = require("node:fs/promises");
const path = require("node:path");
const { v4: uuidv4 } = require("uuid");

const fileName = "quotes.json";
const filePath = path.resolve(__dirname, fileName);

async function addQuote(quoteText) {}

async function getQuotes() {}

async function getRandomQuote() {}

async function editQuote(id, quoteText) {}

async function deleteQuote(id) {}

module.exports = {
  getQuotes,
  addQuote,
  getRandomQuote,
  editQuote,
  deleteQuote,
};

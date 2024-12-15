import fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";
import { FILENAME } from "./config.js";

export async function getQuotes() {}

export async function addQuote(quoteText) {}

export async function getRandomQuote() {}

export async function editQuote(id, quoteText) {}

export async function deleteQuote(id) {}

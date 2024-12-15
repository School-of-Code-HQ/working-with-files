import {
  test,
  describe,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
} from "@jest/globals";
import fs from "node:fs/promises";
import * as uuid from "uuid";

let FILENAME;
let addQuote, getQuotes, getRandomQuote, editQuote, deleteQuote;

await jest.unstable_mockModule("../config.js", () => ({
  FILENAME: "temporary-quotes-for-testing.json",
}));

beforeAll(async () => {
  const config = await import("../config.js");
  FILENAME = config.FILENAME;
  const quote = await import("../quote.js");
  addQuote = quote.addQuote;
  getQuotes = quote.getQuotes;
  getRandomQuote = quote.getRandomQuote;
  editQuote = quote.editQuote;
  deleteQuote = quote.deleteQuote;
  await fs.writeFile(FILENAME, "[]", { encoding: "utf8" });
});

beforeEach(async () => {
  await fs.writeFile(FILENAME, "[]", { encoding: "utf8" });
});

afterAll(async () => {
  await fs.unlink(FILENAME);
});

describe("ticket 2b", () => {
  test("that getQuotes returns all quotes", async () => {
    const quoteText = "This is some random quote test";
    const quotes = [
      { id: uuid.v4(), quoteText },
      { id: uuid.v4(), quoteText },
    ];
    await fs.writeFile(FILENAME, JSON.stringify(quotes), { encoding: "utf8" });
    const result = await getQuotes();
    expect(result).toStrictEqual(quotes);
  });
});

describe("ticket 2c", () => {
  test("that addQuote adds a valid quote", async () => {
    const quoteText = "Five four three two one";
    const result = await addQuote(quoteText);
    const quotes = JSON.parse(
      await fs.readFile(FILENAME, { encoding: "utf8" })
    );
    expect(result).toStrictEqual({
      id: expect.any(String),
      quoteText,
    });
    expect(uuid.validate(result.id)).toBe(true);
    expect(quotes).toContainEqual(result);
  });
});

describe("ticket 2d", () => {
  test("that getRandomQuote returns a random quote", async () => {
    const quoteText = "This is some random quote test";
    const quotes = [
      { id: uuid.v4(), quoteText },
      { id: uuid.v4(), quoteText },
    ];
    await fs.writeFile(FILENAME, JSON.stringify(quotes), { encoding: "utf8" });
    const quote = await getRandomQuote();
    expect(quote).toBeDefined();
    expect(quotes).toContainEqual(quote);
  });
});

describe("ticket 2e", () => {
  test("that editQuote modifies an existing quote", async () => {
    const quoteText = "Five four three two one";
    const editedText = "This has been edited";
    const quotes = [
      { id: uuid.v4(), quoteText },
      { id: uuid.v4(), quoteText },
    ];
    await fs.writeFile(FILENAME, JSON.stringify(quotes), { encoding: "utf8" });
    const editedQuote = await editQuote(quotes[0].id, editedText);
    expect(editedQuote).toStrictEqual({
      id: quotes[0].id,
      quoteText: editedText,
    });
    const updatedQuotes = JSON.parse(
      await fs.readFile(FILENAME, { encoding: "utf8" })
    );
    expect(updatedQuotes).toStrictEqual([
      { id: quotes[0].id, quoteText: editedText },
      quotes[1],
    ]);
  });

  test("that editQuote returns null when the quote id given is non-existent", async () => {
    const quoteText = "Five four three two one";
    const editedText = "This has been edited";
    const quotes = [
      { id: uuid.v4(), quoteText },
      { id: uuid.v4(), quoteText },
    ];
    await fs.writeFile(FILENAME, JSON.stringify(quotes), { encoding: "utf8" });
    const editedQuote = await editQuote("Not a real id", editedText);
    expect(editedQuote).toBeNull();
    const updatedQuotes = JSON.parse(
      await fs.readFile(FILENAME, { encoding: "utf8" })
    );
    expect(updatedQuotes).toStrictEqual(quotes);
  });
});

describe("ticket 2f", () => {
  test("that deleteQuote deletes the correct existing quote", async () => {
    const quoteText = "Five four three two one";
    const quotes = [
      { id: uuid.v4(), quoteText },
      { id: uuid.v4(), quoteText },
    ];
    await fs.writeFile(FILENAME, JSON.stringify(quotes), { encoding: "utf8" });
    const deletedQuote = await deleteQuote(quotes[0].id);
    expect(deletedQuote).toStrictEqual(quotes[0]);
    const updatedQuotes = JSON.parse(
      await fs.readFile(FILENAME, { encoding: "utf8" })
    );
    expect(updatedQuotes).toStrictEqual([quotes[1]]);
  });

  test("that deleteQuote returns null when the quote id given is non-existent", async () => {
    const quoteText = "Five four three two one";
    const quotes = [
      { id: uuid.v4(), quoteText },
      { id: uuid.v4(), quoteText },
    ];
    await fs.writeFile(FILENAME, JSON.stringify(quotes), { encoding: "utf8" });
    const deletedQuote = await deleteQuote("Not a real id");
    expect(deletedQuote).toBeNull();
    const updatedQuotes = JSON.parse(
      await fs.readFile(FILENAME, { encoding: "utf8" })
    );
    expect(updatedQuotes).toStrictEqual(quotes);
  });
});

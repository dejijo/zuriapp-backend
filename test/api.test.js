const { before, after, test } = require("node:test");
const assert = require("node:assert/strict");

process.env.API_SECRET_KEY = "test-secret";
process.env.STORE_NAME = "Test Store";

const app = require("../server");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("GET /api/store returns store information", async () => {
  const response = await fetch(`${baseUrl}/api/store`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.name, "Test Store");
  assert.equal(body.totalProducts, 8);
});

test("GET /api/products returns the product list", async () => {
  const response = await fetch(`${baseUrl}/api/products`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.length, 8);
});

test("GET /api/products/:id returns 404 for a missing product", async () => {
  const response = await fetch(`${baseUrl}/api/products/999999`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.error, "Product not found");
});

test("POST /api/cart/validate rejects a missing API key", async () => {
  const response = await fetch(`${baseUrl}/api/cart/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: [] }),
  });

  assert.equal(response.status, 401);
});

test("POST /api/cart/validate calculates a valid cart total", async () => {
  const response = await fetch(`${baseUrl}/api/cart/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "test-secret",
    },
    body: JSON.stringify({
      items: [{ id: 1, quantity: 2 }],
    }),
  });

  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.items[0].valid, true);
  assert.equal(body.items[0].subtotal, 178);
  assert.equal(body.total, 178);
});

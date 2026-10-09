import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function worker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const ctx = { waitUntil() {}, passThroughOnException() {} };

test("server-renders the personal homepage", async () => {
  const response = await (await worker()).fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Making intelligence/);
  assert.match(html, /Lulu Zhao/);
});

test("server-renders the Severance classroom experience", async () => {
  const response = await (await worker()).fetch(
    new Request("http://localhost/severance", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>What Crosses\? — Lulu Zhao<\/title>/i);
  assert.match(html, /WHAT CROSSES\?/);
  assert.match(html, /\/severance\/severance\.css/);
});

test("rejects empty Severance chat requests before calling the model", async () => {
  const response = await (await worker()).fetch(
    new Request("http://localhost/api/severance/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "" }),
    }),
    env,
    ctx,
  );
  assert.equal(response.status, 400);
});

test("requires a visitor-provided key and never reads a hosted API key", async () => {
  const [client, route, styles] = await Promise.all([
    readFile(new URL("../public/severance/severance.js", import.meta.url), "utf8"),
    readFile(new URL("../app/api/severance/chat/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../public/severance/severance.css", import.meta.url), "utf8"),
  ]);
  assert.match(client, /type="password"/);
  assert.match(client, /CORNELL AI — CLASSROOM/);
  assert.match(client, /OPENAI API/);
  assert.match(client, /The key is not stored/);
  assert.doesNotMatch(client, /localStorage|sessionStorage/);
  assert.match(route, /payload\.apiKey/);
  assert.match(route, /api\.ai\.it\.cornell\.edu\/v1/);
  assert.match(route, /api\.openai\.com\/v1/);
  assert.match(route, /rate limit or insufficient API credits/);
  assert.doesNotMatch(route, /process\.env\.(?:OPENAI_API_KEY|LLM_HOST)/);
  assert.match(styles, /\.severance-shell \.primary\{background:var\(--ink\);color:var\(--paper\)\}/);
  assert.match(styles, /button\.active\{background:var\(--accent\);color:#fff\}/);
});

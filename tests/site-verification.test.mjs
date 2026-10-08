import assert from "node:assert/strict";
import test from "node:test";

async function renderPath(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    }
  );
}

test("Home page renders correctly per design spec", async () => {
  const res = await renderPath("/");
  assert.equal(res.status, 200);
  const html = await res.text();

  // Heading and bio
  assert.match(html, /Hi, I’m Lulu\./);
  assert.match(html, /CS PhD student · Cornell University/);
  assert.match(html, /human–AI interaction and design/);

  // Selected works
  assert.match(html, /Manipulating Elasto-Plastic Objects/);
  assert.match(html, /AnchorIT/);
  assert.match(html, /Foam Hand/);

  // MoveBot must NOT be in public home
  assert.doesNotMatch(html, /MoveBot/);

  // Character presence
  assert.match(html, /Say hello to LuluBot/);

  // Email action
  assert.match(html, /lz625@cornell\.edu/);
  assert.match(html, /motion-toggle-btn/);
  assert.match(html, /Motion:\s*(<!-- -->)?on/);
});

test("Research archive excludes MoveBot and includes approved projects", async () => {
  const res = await renderPath("/research");
  assert.equal(res.status, 200);
  const html = await res.text();

  assert.match(html, /Questions explored through making\./);
  assert.match(html, /Manipulating Elasto-Plastic Objects/);
  assert.match(html, /AnchorIT/);
  assert.match(html, /Foam Hand/);
  assert.doesNotMatch(html, /MoveBot/);
});

test("Publications page lists approved papers and venues", async () => {
  const res = await renderPath("/publications");
  assert.equal(res.status, 200);
  const html = await res.text();

  assert.match(html, /Manipulating Elasto-Plastic Objects With 3D Occupancy/);
  assert.match(html, /IEEE RA-L 2025 · ICRA 2026 Transfer/);
  assert.match(html, /T1 and T2 Mapping Reconstruction Based on Conditional DDPM/);
});

test("About page contains accurate education milestones", async () => {
  const res = await renderPath("/about");
  assert.equal(res.status, 200);
  const html = await res.text();

  assert.match(html, /Cornell University/);
  assert.match(html, /Beijing Normal University/);
  assert.match(html, /The Chinese University of Hong Kong/);
  assert.match(html, /Carnegie Mellon University/);
  assert.match(html, /Ph\.D\. in Computer Science/);
});

test("Photography page contains collection items", async () => {
  const res = await renderPath("/photography");
  assert.equal(res.status, 200);
  const html = await res.text();

  assert.match(html, /Light, weather &amp; passing things\./);
  assert.match(html, /Old San Juan, Puerto Rico/);
});

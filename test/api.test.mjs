// Runs the built site against a fake mail server, so no real email is sent.
// Needs a build first: npm run build && npm test
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { after, before, test } from "node:test";

let site;
let app;
let mailFails = false;
let sent = 0;

const mail = createServer((req, res) => {
  req.resume();
  if (!mailFails) sent++;
  res.writeHead(mailFails ? 429 : 200, { "content-type": "application/json" });
  res.end(mailFails ? '{"name":"daily_quota_exceeded","message":"quota used up"}' : '{"id":"1"}');
});

const freePort = async () => {
  const probe = createServer().listen(0, "127.0.0.1");
  await once(probe, "listening");
  const { port } = probe.address();
  probe.close();
  return port;
};

before(async () => {
  mail.listen(0, "127.0.0.1");
  await once(mail, "listening");
  const port = await freePort();
  site = `http://127.0.0.1:${port}`;
  // These win over .env, so the real key and inbox are never used here.
  app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)], {
    env: {
      ...process.env,
      RESEND_FIRST_API_KEY: "re_fake",
      RESEND_BASE_URL: `http://127.0.0.1:${mail.address().port}`,
      PERSONNAL_MAIL_ADDRESS: "inbox@example.com",
    },
    stdio: "ignore",
  });
  for (let tries = 0; ; tries++) {
    if (app.exitCode !== null || tries > 150) throw new Error("the site did not start: run npm run build first");
    try {
      await fetch(site);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
});

after(() => {
  app?.kill();
  mail.close();
});

// Each call comes from its own address, so only the last test hits the rate limit.
let caller = 0;
const post = (path, body, from = `10.0.0.${++caller}`) =>
  fetch(site + path, { method: "POST", headers: { "x-forwarded-for": from }, body: JSON.stringify(body) });

const message = { name: "Ada", email: "ada@example.com", message: "Hello there, this is a test." };
const demo = { project: "URL Shortener", email: "ada@example.com", note: "Show me the dashboard." };

test("a good message and a good demo request are each sent once", async () => {
  assert.equal((await post("/api/send", message)).status, 200);
  assert.equal((await post("/api/request-demo", demo)).status, 200);
  assert.equal(sent, 2);
});

test("bad input is refused and no mail goes out", async () => {
  const long = "x".repeat(1001);
  for (const bad of [{}, { ...message, name: { first: "Ada" } }, { ...message, email: "not-an-email" }, { ...message, message: long }]) {
    assert.equal((await post("/api/send", bad)).status, 400, JSON.stringify(bad).slice(0, 80));
  }
  for (const bad of [{}, { ...demo, project: "Not A Project" }, { ...demo, email: "not-an-email" }, { ...demo, note: long }]) {
    assert.equal((await post("/api/request-demo", bad)).status, 400, JSON.stringify(bad).slice(0, 80));
  }
  assert.equal(sent, 2);
});

test("a huge email is refused at once", { timeout: 5000 }, async () => {
  // The email pattern takes about a minute on this input, so the length check must run first.
  const huge = `a@${".".repeat(200_000)} `;
  assert.equal((await post("/api/send", { ...message, email: huge })).status, 400);
  assert.equal((await post("/api/request-demo", { ...demo, email: huge })).status, 400);
});

test("a failed send is reported, not shown as a success", async () => {
  mailFails = true;
  assert.equal((await post("/api/send", message)).status, 500);
  assert.equal((await post("/api/request-demo", demo)).status, 500);
  mailFails = false;
});

test("one address is cut off after 10 requests", async () => {
  const statuses = [];
  for (let i = 0; i < 11; i++) statuses.push((await post("/api/send", message, "10.9.9.9")).status);
  assert.deepEqual(statuses, [...Array(10).fill(200), 429]);
});

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.resolve(__dirname, "../background.js"), "utf8");
let listener;
const data = {};
const chrome = {
  runtime: { onMessage: { addListener(callback) { listener = callback; } } },
  storage: { local: {
    async get(key) { return { [key]: data[key] }; },
    async set(values) { Object.assign(data, values); }
  } }
};
vm.runInNewContext(source, { chrome, Promise, Date, Set });

function send(action, details = {}) {
  return new Promise((resolve) => listener({ source: "gaveta-youtube", action, ...details }, {}, resolve));
}

(async () => {
  const a = { id: "ESABTN4VtrA", title: "  Primeiro   vídeo  ", kind: "watch" };
  const b = { id: "dQw4w9WgXcQ", title: "Segundo vídeo", kind: "watch" };
  const [first, second] = await Promise.all([send("add", { item: a }), send("add", { item: b })]);
  assert.equal(first.status, "added");
  assert.equal(second.status, "added");
  assert.deepEqual(Array.from((await send("list")).queue, (item) => item.id), [a.id, b.id]);
  assert.equal((await send("add", { item: a })).status, "exists");
  assert.equal((await send("list")).queue.length, 2);

  await send("move", { id: b.id, direction: -1 });
  assert.deepEqual(Array.from((await send("list")).queue, (item) => item.id), [b.id, a.id]);
  await send("reorder", { id: a.id, targetId: b.id, before: true });
  assert.deepEqual(Array.from((await send("list")).queue, (item) => item.id), [a.id, b.id]);
  assert.equal((await send("reorder", { id: a.id, targetId: "missing", before: true })).ok, false);
  await send("remove", { id: b.id });
  assert.deepEqual(Array.from((await send("list")).queue, (item) => item.id), [a.id]);

  const bad = await send("add", { item: { id: "not-video-id", title: "Bad" } });
  assert.equal(bad.ok, false);
  const sanitized = (await send("list")).queue[0];
  assert.equal(sanitized.title, "Primeiro vídeo");
  assert.equal(sanitized.url, "https://www.youtube.com/watch?v=ESABTN4VtrA");
  console.log("PASS: queue storage, duplicates, ordering, removal, and validation");
})().catch((error) => { console.error(error); process.exitCode = 1; });

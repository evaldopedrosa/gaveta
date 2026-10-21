"use strict";

const STORAGE_KEY = "gavetaYoutubeVideosV1";
const MAX_ITEMS = 300;
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
let pending = Promise.resolve();

function cleanTitle(value) {
  if (typeof value !== "string") return "Vídeo sem título";
  const title = value.replace(/\s+/g, " ").trim().slice(0, 180);
  return title || "Vídeo sem título";
}

function cleanItem(value) {
  if (!value || typeof value !== "object" || typeof value.id !== "string" || !VIDEO_ID.test(value.id)) return null;
  const kind = value.kind === "shorts" ? "shorts" : "watch";
  return {
    id: value.id,
    kind,
    title: cleanTitle(value.title),
    url: kind === "shorts"
      ? `https://www.youtube.com/shorts/${value.id}`
      : `https://www.youtube.com/watch?v=${value.id}`,
    savedAt: typeof value.savedAt === "number" && Number.isFinite(value.savedAt)
      ? value.savedAt
      : Date.now()
  };
}

async function readQueue() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const raw = stored[STORAGE_KEY];
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const queue = [];
  for (const value of raw) {
    const item = cleanItem(value);
    if (!item || seen.has(item.id)) continue;
    seen.add(item.id);
    queue.push(item);
    if (queue.length === MAX_ITEMS) break;
  }
  return queue;
}

async function updateQueue(message) {
  const queue = await readQueue();
  let status = "ok";

  if (message.action === "add") {
    const item = cleanItem(message.item);
    if (!item) return { ok: false, error: "Vídeo inválido." };
    if (queue.some((entry) => entry.id === item.id)) {
      return { ok: true, status: "exists", count: queue.length, ...(message.includeQueue ? { queue } : {}) };
    }
    if (queue.length >= MAX_ITEMS) {
      return { ok: false, error: "A gaveta chegou ao limite de 300 vídeos." };
    }
    queue.push({ ...item, savedAt: Date.now() });
    status = "added";
  } else if (message.action === "remove") {
    if (typeof message.id !== "string") return { ok: false, error: "Vídeo inválido." };
    const index = queue.findIndex((item) => item.id === message.id);
    if (index < 0) return { ok: true, status: "missing", count: queue.length, ...(message.includeQueue ? { queue } : {}) };
    queue.splice(index, 1);
    status = "removed";
  } else if (message.action === "move") {
    if (typeof message.id !== "string" || ![1, -1].includes(message.direction)) {
      return { ok: false, error: "Movimento inválido." };
    }
    const index = queue.findIndex((item) => item.id === message.id);
    const next = index + message.direction;
    if (index < 0 || next < 0 || next >= queue.length) {
      return { ok: true, status: "unchanged", count: queue.length, ...(message.includeQueue ? { queue } : {}) };
    }
    [queue[index], queue[next]] = [queue[next], queue[index]];
    status = "moved";
  } else if (message.action === "reorder") {
    if (typeof message.id !== "string" || typeof message.targetId !== "string" ||
        typeof message.before !== "boolean") {
      return { ok: false, error: "Ordem inválida." };
    }
    const from = queue.findIndex((item) => item.id === message.id);
    const target = queue.findIndex((item) => item.id === message.targetId);
    if (from < 0 || target < 0) return { ok: false, error: "Vídeo não encontrado." };
    if (from === target) {
      return { ok: true, status: "unchanged", count: queue.length, ...(message.includeQueue ? { queue } : {}) };
    }
    const [item] = queue.splice(from, 1);
    const destination = queue.findIndex((entry) => entry.id === message.targetId);
    queue.splice(destination + (message.before ? 0 : 1), 0, item);
    status = "moved";
  } else {
    return { ok: false, error: "Ação desconhecida." };
  }

  await chrome.storage.local.set({ [STORAGE_KEY]: queue });
  return { ok: true, status, count: queue.length, ...(message.includeQueue ? { queue } : {}) };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.source !== "gaveta-youtube") return false;

  if (message.action === "list") {
    readQueue()
      .then((queue) => sendResponse({ ok: true, queue }))
      .catch(() => sendResponse({ ok: false, error: "Não foi possível ler a gaveta." }));
    return true;
  }

  if (message.action === "count") {
    readQueue()
      .then((queue) => sendResponse({ ok: true, count: queue.length }))
      .catch(() => sendResponse({ ok: false, error: "Não foi possível contar os vídeos." }));
    return true;
  }

  const operation = pending.then(() => updateQueue(message));
  pending = operation.catch(() => {});
  operation
    .then(sendResponse)
    .catch(() => sendResponse({ ok: false, error: "Não foi possível salvar a gaveta." }));
  return true;
});

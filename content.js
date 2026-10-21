(() => {
  "use strict";

  if (window !== window.top || document.getElementById("gaveta-youtube-root")) return;

  const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
  const STORAGE_KEY = "gavetaYoutubeVideosV1";
  const CARD_SELECTOR = "ytd-rich-grid-media, ytd-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-playlist-video-renderer, yt-lockup-view-model";
  const host = document.createElement("div");
  host.id = "gaveta-youtube-root";
  host.style.cssText = "position:fixed;inset:0;width:0;height:0;z-index:2147483647;pointer-events:none";
  (document.documentElement || document.body).append(host);
  const shadow = host.attachShadow({ mode: "open" });
  const toolbarHost = document.createElement("div");
  toolbarHost.id = "gaveta-youtube-toolbar";
  toolbarHost.style.cssText = "display:inline-flex;align-items:center;flex:none;margin-inline:8px";
  const toolbarShadow = toolbarHost.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    :host {
      all: initial;
      color-scheme: light;
      --g-bg: #fff;
      --g-text: #181818;
      --g-strong: #141414;
      --g-muted: #666;
      --g-subtle: #777;
      --g-soft: #f2f2f2;
      --g-soft-hover: #e5e5e5;
      --g-hover: #f8f8f8;
      --g-border: #ececec;
      --g-item-border: #e7e7e7;
      --g-accent: #e4002b;
      --g-accent-soft: #fff0f3;
      --g-focus: #002fa7;
      --g-toast-bg: #141414;
    }
    *, *::before, *::after { box-sizing: border-box; }
    [hidden] { display: none !important; }
    button, a { -webkit-tap-highlight-color: transparent; }
    button { cursor: pointer; font: inherit; }
    .launcher, .float-save, .panel, .toast { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
    .launcher { display: inline-flex; align-items: center; gap: 7px; min-height: 36px; padding: 0 11px;
      color: var(--g-text); background: var(--g-soft); border: 0; border-radius: 18px;
      font-size: 12px; font-weight: 700; white-space: nowrap; pointer-events: auto; }
    .launcher:hover, .launcher[aria-expanded="true"] { background: var(--g-soft-hover); }
    .launcher svg { width: 16px; height: 16px; stroke: currentColor; stroke-width: 1.8; fill: none; }
    .launcher-count { min-width: 20px; padding: 2px 5px; color: #fff; background: #e4002b;
      border-radius: 8px; font-size: 10px; font-variant-numeric: tabular-nums; text-align: center; }
    .float-save { position: fixed; display: inline-flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; padding: 0; background: rgba(15,15,15,.82); color: #fff; border: 0; border-radius: 5px;
      box-shadow: 0 2px 8px rgba(0,0,0,.25); pointer-events: auto; z-index: 4; }
    .float-save:hover { background: var(--g-accent); }
    .float-save svg { width: 19px; height: 19px; stroke: currentColor; stroke-width: 2; fill: none; }
    .panel { position: fixed; right: 18px; top: 64px; width: min(390px, calc(100vw - 36px)); max-height: min(720px, calc(100vh - 82px));
      display: flex; flex-direction: column; overflow: hidden; background: var(--g-bg); color: var(--g-text);
      border: 1px solid var(--g-soft-hover); border-radius: 18px; box-shadow: 0 14px 45px rgba(0,0,0,.18);
      pointer-events: auto; z-index: 5; font-size: 13px; }
    .panel-head { display: flex; align-items: center; gap: 10px; padding: 16px;
      border-bottom: 1px solid var(--g-border); }
    .panel-icon { display: grid; place-items: center; width: 34px; height: 34px; flex: none;
      color: var(--g-accent); background: var(--g-accent-soft); border-radius: 11px; }
    .panel-icon svg { width: 18px; height: 18px; stroke: currentColor; stroke-width: 1.8; fill: none; }
    h2 { flex: 1; margin: 0; color: var(--g-text); font-size: 16px; font-weight: 700; line-height: 1.2; }
    .head-count { color: var(--g-muted); background: var(--g-soft); border-radius: 10px; padding: 3px 7px;
      font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums; }
    .close { display: grid; place-items: center; width: 30px; height: 30px; flex: none; padding: 0;
      background: transparent; border: 0; border-radius: 15px; color: var(--g-muted); font-size: 21px; line-height: 1; }
    .close:hover { background: var(--g-soft); color: var(--g-text); }
    .panel-tools { padding: 12px 16px; border-bottom: 1px solid var(--g-border); }
    .save-current { width: 100%; min-height: 34px; padding: 0 12px; background: var(--g-text); color: var(--g-bg);
      border: 0; border-radius: 10px; text-align: center; font-size: 12px; font-weight: 700; }
    .save-current:hover:not(:disabled) { background: var(--g-accent); color: #fff; }
    .save-current:disabled { color: var(--g-muted); background: var(--g-soft); cursor: default; }
    .hint { margin: 0; padding: 10px 16px; color: var(--g-muted); font-size: 11px; line-height: 1.4; border-bottom: 1px solid var(--g-border); }
    .list { flex: 1; min-height: 0; overflow-y: auto; margin: 0; padding: 0; list-style: none; overscroll-behavior: contain; }
    .item { display: grid; grid-template-columns: 18px 82px minmax(0,1fr) 28px; align-items: center; gap: 8px;
      padding: 12px 13px; border-bottom: 1px solid var(--g-item-border); position: relative; }
    .item:hover { background: var(--g-hover); }
    .item[data-drop-position="before"]::before, .item[data-drop-position="after"]::after {
      content: ""; position: absolute; left: 12px; right: 12px; height: 3px; border-radius: 2px; background: var(--g-accent); }
    .item[data-drop-position="before"]::before { top: -2px; }
    .item[data-drop-position="after"]::after { bottom: -2px; }
    .drag-handle, .remove { display: grid; place-items: center; padding: 0; border: 0; background: transparent;
      color: var(--g-subtle); border-radius: 7px; }
    .drag-handle { width: 18px; height: 32px; cursor: grab; touch-action: none; }
    .drag-handle:active { cursor: grabbing; }
    .drag-handle:hover, .remove:hover { color: var(--g-accent); background: var(--g-accent-soft); }
    .drag-handle svg { width: 14px; height: 18px; fill: currentColor; }
    .remove { width: 28px; height: 28px; align-self: start; }
    .remove svg { width: 16px; height: 16px; stroke: currentColor; stroke-width: 1.8; fill: none; }
    .thumb { display: block; width: 82px; height: 47px; object-fit: cover; background: var(--g-item-border); }
    .item-link { display: block; min-width: 0; color: var(--g-strong); text-decoration: none; }
    .item-link:hover .item-title { color: var(--g-accent); text-decoration: underline; }
    .item-title { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
      font-size: 13px; font-weight: 700; line-height: 1.3; }
    .item-number { display: block; margin-bottom: 4px; color: var(--g-subtle); font-size: 10px; font-weight: 700; font-variant-numeric: tabular-nums; }
    .empty { padding: 26px 16px; color: var(--g-muted); font-size: 13px; line-height: 1.5; }
    .empty strong { display: block; margin-bottom: 7px; color: var(--g-strong); font-size: 15px; }
    .empty-shortcut { margin-top: 16px; padding: 12px; background: var(--g-soft); border-radius: 10px; }
    .empty-shortcut-label { display: block; margin-bottom: 5px; color: var(--g-subtle); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
    kbd { display: inline-block; padding: 2px 5px; border: 1px solid var(--g-soft-hover); border-radius: 4px; background: var(--g-bg); color: var(--g-text); font-family: inherit; font-size: 11px; font-weight: 700; }
    .panel-foot { padding: 10px 16px; border-top: 1px solid var(--g-border); color: var(--g-subtle); font-size: 10px; }
    .foot-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .foot-row + .foot-row { margin-top: 8px; }
    .export-list { padding: 3px 0; border: 0; background: transparent; color: var(--g-text);
      font-size: 11px; font-weight: 700; white-space: nowrap; }
    .export-list:hover { color: var(--g-accent); text-decoration: underline; }
    .export-list:disabled { color: #aaa; cursor: default; text-decoration: none; }
    .credit { color: var(--g-muted); }
    .credit a { color: inherit; font-weight: 700; text-decoration: none; }
    .credit a:hover { color: var(--g-accent); text-decoration: underline; }
    .toast { position: fixed; right: 16px; bottom: 20px; max-width: 300px; padding: 10px 12px;
      color: #fff; background: var(--g-toast-bg); border-left: 3px solid var(--g-accent); box-shadow: 0 3px 12px rgba(0,0,0,.2);
      pointer-events: none; z-index: 6; font-size: 12px; line-height: 1.3; }
    :is(button, a):focus-visible { outline: 2px solid var(--g-focus); outline-offset: 2px; }
    @media (prefers-color-scheme: dark) {
      :host {
        color-scheme: dark;
        --g-bg: #202124;
        --g-text: #f1f1f1;
        --g-strong: #fff;
        --g-muted: #b6b6b6;
        --g-subtle: #aaa;
        --g-soft: #303134;
        --g-soft-hover: #444549;
        --g-hover: #2b2c2f;
        --g-border: #3b3c40;
        --g-item-border: #38393d;
        --g-accent: #ff4866;
        --g-accent-soft: #4b2530;
        --g-focus: #8ab4f8;
        --g-toast-bg: #38393d;
      }
      .panel { box-shadow: 0 14px 45px rgba(0,0,0,.45); }
    }
    @media (max-width: 600px) { .panel { top: 56px; right: 8px; width: calc(100vw - 16px); } }
  `;
  shadow.append(style);
  toolbarShadow.append(style.cloneNode(true));

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "launcher";
  launcher.setAttribute("aria-label", "Abrir gaveta de vídeos");
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v4H4zM5 9v10h14V9M9 13h6"/></svg><span>Gaveta</span><span class="launcher-count">0</span>';

  const floatSave = document.createElement("button");
  floatSave.type = "button";
  floatSave.className = "float-save";
  floatSave.setAttribute("aria-label", "Guardar vídeo na gaveta");
  floatSave.title = "Guardar na Gaveta";
  floatSave.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  floatSave.hidden = true;

  const panel = document.createElement("section");
  panel.className = "panel";
  panel.setAttribute("aria-label", "Gaveta de vídeos do YouTube");
  panel.hidden = true;
  panel.innerHTML = `
    <div class="panel-head"><span class="panel-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v4H4zM5 9v10h14V9M9 13h6"/></svg></span><h2>Gaveta</h2>
      <span class="head-count" aria-label="0 vídeos">0</span><button class="close" type="button" aria-label="Recolher gaveta">×</button></div>
    <div class="panel-tools"><button class="save-current" type="button" hidden>Guardar este vídeo</button></div>
    <p class="hint">Option + clique em um vídeo para guardar sem abrir outra aba.</p>
    <ol class="list"></ol><div class="panel-foot">
      <div class="foot-row"><span>Links salvos neste Chrome.</span><button class="export-list" type="button" aria-label="Baixar lista de vídeos em CSV">Baixar lista ↓</button></div>
      <div class="foot-row"><span>Arraste pela alça para ordenar.</span><span class="credit">Feito por <a href="https://evakdo.com/" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Evakdo</a></span></div>
    </div>`;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.hidden = true;
  toolbarShadow.append(launcher);
  shadow.append(floatSave, panel, toast);

  const countBadge = launcher.querySelector(".launcher-count");
  const headCount = panel.querySelector(".head-count");
  const list = panel.querySelector(".list");
  const saveCurrent = panel.querySelector(".save-current");
  const exportList = panel.querySelector(".export-list");
  let queue = [];
  let count = 0;
  let isOpen = false;
  let hovered = null;
  let hoveredCard = null;
  let draggedId = null;
  let dropRow = null;
  let hideTimer = 0;
  let toastTimer = 0;

  function parseVideoUrl(href) {
    try {
      const url = new URL(href, location.href);
      if (!/^(www\.)?youtube\.com$/.test(url.hostname) || url.protocol !== "https:") return null;
      let id;
      let kind = "watch";
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else {
        const match = url.pathname.match(/^\/(shorts|live)\/([A-Za-z0-9_-]{11})(?:\/|$)/);
        if (!match) return null;
        kind = match[1] === "shorts" ? "shorts" : "watch";
        id = match[2];
      }
      return VIDEO_ID.test(id || "") ? { id, kind } : null;
    } catch {
      return null;
    }
  }

  function getTitle(anchor) {
    const card = anchor.closest(CARD_SELECTOR);
    const title = card?.querySelector(
      "a#video-title, #video-title, h3, .yt-lockup-metadata-view-model__title"
    );
    return (title?.textContent || anchor.getAttribute("title") || anchor.getAttribute("aria-label") ||
      anchor.querySelector("img")?.getAttribute("alt") || "Vídeo sem título").replace(/\s+/g, " ").trim();
  }

  function candidateFromAnchor(anchor) {
    const parsed = parseVideoUrl(anchor.href);
    return parsed ? { ...parsed, title: getTitle(anchor) } : null;
  }

  function currentVideo() {
    const parsed = parseVideoUrl(location.href);
    if (!parsed) return null;
    const title = document.querySelector("h1 yt-formatted-string, h1")?.textContent ||
      document.title.replace(/\s*-\s*YouTube\s*$/, "");
    return { ...parsed, title: title?.trim() || "Vídeo sem título" };
  }

  function isThumbnail(anchor) {
    return anchor.id === "thumbnail" || anchor.matches(".yt-lockup-view-model__content-image") ||
      Boolean(anchor.querySelector("img")) || Boolean(anchor.closest("ytd-thumbnail"));
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2300);
  }

  function mountToolbar() {
    const end = document.querySelector("ytd-masthead #end, #masthead-container #end");
    if (!end) return false;
    if (toolbarHost.parentNode !== end) end.prepend(toolbarHost);
    return true;
  }

  if (!mountToolbar()) {
    const toolbarObserver = new MutationObserver(() => {
      if (mountToolbar()) toolbarObserver.disconnect();
    });
    toolbarObserver.observe(document.documentElement, { childList: true, subtree: true });
  }
  document.addEventListener("yt-navigate-finish", () => {
    mountToolbar();
    if (isOpen) render();
  });
  window.addEventListener("popstate", () => { if (isOpen) render(); });

  function updateCount(value) {
    count = Number.isInteger(value) ? value : 0;
    countBadge.textContent = String(count);
    headCount.textContent = String(count);
    headCount.setAttribute("aria-label", `${count} vídeos`);
    exportList.disabled = count === 0;
  }

  function csvCell(value) {
    const text = String(value ?? "").replace(/^[\s\uFEFF]*[=+\-@]/, (match) => `'${match}`);
    return `"${text.replace(/"/g, '""')}"`;
  }

  function savedAtText(value) {
    if (!Number.isFinite(value)) return "";
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toISOString() : "";
  }

  async function downloadList() {
    try {
      const result = await send("list");
      if (!result?.ok || !Array.isArray(result.queue)) throw new Error(result?.error || "Não foi possível ler a lista.");
      if (result.queue.length === 0) return showToast("Sua gaveta está vazia.");
      const rows = [["Título", "Link", "Salvo em"], ...result.queue.map((item) => [
        item.title, item.url, savedAtText(item.savedAt)
      ])];
      const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `gaveta-videos-${new Date().toISOString().slice(0, 10)}.csv`;
      anchor.style.display = "none";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      showToast(`${result.queue.length} vídeo${result.queue.length === 1 ? "" : "s"} na lista baixada.`);
    } catch (error) {
      showToast(error.message || "Não foi possível baixar a lista.");
    }
  }

  function send(action, details = {}) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ source: "gaveta-youtube", action, ...details }, (response) => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else resolve(response);
      });
    });
  }

  async function save(candidate) {
    if (!candidate) return;
    try {
      const result = await send("add", { item: candidate, includeQueue: isOpen });
      if (!result?.ok) throw new Error(result?.error || "Não foi possível guardar o vídeo.");
      updateCount(result.count);
      if (isOpen && Array.isArray(result.queue)) {
        queue = result.queue;
        render();
      }
      showToast(result.status === "exists" ? "Este vídeo já está na gaveta." : "Vídeo guardado na gaveta.");
    } catch (error) {
      showToast(error.message || "Não foi possível guardar o vídeo.");
    }
  }

  function hideFloat() {
    clearTimeout(hideTimer);
    hovered = null;
    hoveredCard = null;
    floatSave.hidden = true;
  }

  function thumbnailFromTarget(target) {
    const direct = target.closest("a[href]");
    if (direct && isThumbnail(direct)) return direct;
    const card = target.closest(CARD_SELECTOR);
    if (!card) return null;
    return Array.from(card.querySelectorAll("a[href]")).find((anchor) => isThumbnail(anchor) && candidateFromAnchor(anchor)) || null;
  }

  function showFloat(anchor, x, y) {
    if (isOpen || !isThumbnail(anchor)) return;
    const candidate = candidateFromAnchor(anchor);
    if (!candidate) return;
    const rect = anchor.getBoundingClientRect();
    if (rect.width < 80 || rect.height < 35 || rect.bottom < 0 || rect.top > innerHeight) return;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return;
    clearTimeout(hideTimer);
    hovered = candidate;
    hoveredCard = anchor.closest(CARD_SELECTOR) || anchor;
    floatSave.style.top = `${Math.max(8, rect.top + 8)}px`;
    floatSave.style.left = `${Math.max(8, rect.left + 8)}px`;
    floatSave.hidden = false;
  }

  async function setOpen(open) {
    isOpen = open;
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    hideFloat();
    if (open) {
      try {
        const result = await send("list");
        if (!result?.ok) throw new Error(result?.error || "Não foi possível carregar a gaveta.");
        if (!isOpen) return;
        queue = result.queue;
        updateCount(queue.length);
      } catch (error) {
        showToast(error.message || "Não foi possível carregar a gaveta.");
      }
      render();
      panel.querySelector(".close").focus();
    } else {
      queue = [];
      list.replaceChildren();
      launcher.focus();
    }
  }

  function makeRow(item, index) {
    const row = document.createElement("li");
    row.className = "item";
    row.dataset.videoId = item.id;
    const itemUrl = item.kind === "shorts"
      ? `https://www.youtube.com/shorts/${item.id}`
      : `https://www.youtube.com/watch?v=${item.id}`;
    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "drag-handle";
    handle.draggable = true;
    handle.title = "Arrastar para reordenar";
    handle.setAttribute("aria-label", `Reordenar ${item.title}. Use as setas para cima e para baixo.`);
    handle.innerHTML = '<svg viewBox="0 0 14 18" aria-hidden="true"><circle cx="4" cy="3" r="1.5"/><circle cx="10" cy="3" r="1.5"/><circle cx="4" cy="9" r="1.5"/><circle cx="10" cy="9" r="1.5"/><circle cx="4" cy="15" r="1.5"/><circle cx="10" cy="15" r="1.5"/></svg>';
    const imageLink = document.createElement("a");
    imageLink.className = "item-link";
    imageLink.href = itemUrl;
    imageLink.setAttribute("aria-label", `Abrir ${item.title}`);
    const image = document.createElement("img");
    image.className = "thumb";
    image.src = `https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;
    imageLink.append(image);

    const body = document.createElement("div");
    const number = document.createElement("span");
    number.className = "item-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const titleLink = document.createElement("a");
    titleLink.className = "item-link";
    titleLink.href = itemUrl;
    const title = document.createElement("span");
    title.className = "item-title";
    title.textContent = item.title;
    titleLink.append(title);
    body.append(number, titleLink);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.title = "Remover da Gaveta";
    remove.setAttribute("aria-label", `Remover ${item.title}`);
    remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>';
    row.append(handle, imageLink, body, remove);
    return row;
  }

  async function change(action, details, focusId = null) {
    try {
      const result = await send(action, { ...details, includeQueue: true });
      if (!result?.ok) throw new Error(result?.error || "Não foi possível alterar a gaveta.");
      updateCount(result.count);
      if (!isOpen) return;
      const scrollTop = list.scrollTop;
      queue = result.queue;
      render();
      list.scrollTop = scrollTop;
      if (focusId) Array.from(list.children).find((row) => row.dataset.videoId === focusId)?.querySelector(".drag-handle")?.focus();
    } catch (error) {
      showToast(error.message || "Não foi possível alterar a gaveta.");
    }
  }

  function render() {
    if (!isOpen) return;
    const video = currentVideo();
    const alreadySaved = video && queue.some((item) => item.id === video.id);
    saveCurrent.hidden = !video;
    saveCurrent.disabled = Boolean(alreadySaved);
    saveCurrent.textContent = alreadySaved ? "Já está na Gaveta" : "Guardar este vídeo";
    list.replaceChildren();
    if (queue.length === 0) {
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.innerHTML = '<strong>Sua gaveta está vazia.</strong><span>Passe o mouse sobre uma miniatura e clique em + para guardar um vídeo.</span><div class="empty-shortcut"><span class="empty-shortcut-label">Atalho rápido</span><kbd>Option</kbd> (Alt) + clique no link de um vídeo</div>';
      list.append(empty);
      return;
    }
    const fragment = document.createDocumentFragment();
    queue.forEach((item, index) => fragment.append(makeRow(item, index)));
    list.append(fragment);
  }

  launcher.addEventListener("click", () => setOpen(!isOpen));
  panel.querySelector(".close").addEventListener("click", () => setOpen(false));
  saveCurrent.addEventListener("click", () => save(currentVideo()));
  exportList.addEventListener("click", downloadList);
  floatSave.addEventListener("pointerenter", () => clearTimeout(hideTimer));
  floatSave.addEventListener("pointerleave", () => {
    hideTimer = setTimeout(hideFloat, 120);
  });
  floatSave.addEventListener("click", () => {
    const candidate = hovered;
    hideFloat();
    save(candidate);
  });

  function clearDropMarkers() {
    if (dropRow) delete dropRow.dataset.dropPosition;
    dropRow = null;
  }

  list.addEventListener("dragstart", (event) => {
    const handle = event.target instanceof Element && event.target.closest(".drag-handle");
    if (!handle || !event.dataTransfer) return;
    draggedId = handle.closest(".item")?.dataset.videoId || null;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", "");
  });
  list.addEventListener("dragover", (event) => {
    const row = event.target instanceof Element && event.target.closest(".item");
    if (!row || !draggedId || row.dataset.videoId === draggedId) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    const midpoint = row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2;
    const position = event.clientY < midpoint ? "before" : "after";
    if (dropRow !== row) clearDropMarkers();
    if (row.dataset.dropPosition !== position) row.dataset.dropPosition = position;
    dropRow = row;
  });
  list.addEventListener("drop", (event) => {
    const row = event.target instanceof Element && event.target.closest(".item");
    if (!row || !draggedId || row.dataset.videoId === draggedId) return;
    event.preventDefault();
    const id = draggedId;
    const targetId = row.dataset.videoId;
    const before = row.dataset.dropPosition === "before";
    draggedId = null;
    clearDropMarkers();
    change("reorder", { id, targetId, before }, id);
  });
  list.addEventListener("dragend", () => {
    draggedId = null;
    clearDropMarkers();
  });
  list.addEventListener("keydown", (event) => {
    const handle = event.target instanceof Element && event.target.closest(".drag-handle");
    if (!handle || !["ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const id = handle.closest(".item")?.dataset.videoId;
    if (id) change("move", { id, direction: event.key === "ArrowUp" ? -1 : 1 }, id);
  });
  list.addEventListener("click", (event) => {
    const button = event.target instanceof Element && event.target.closest(".remove");
    const id = button?.closest(".item")?.dataset.videoId;
    if (id) change("remove", { id });
  });
  function openFromQueue(event) {
    if ((event.type === "click" && (event.button !== 0 || event.altKey)) ||
        (event.type === "auxclick" && event.button !== 1)) return;
    const link = event.target instanceof Element && event.target.closest(".item-link");
    const videoId = link?.closest(".item")?.dataset.videoId;
    if (!videoId) return;
    if (event.type === "click" && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      const url = link.href;
      change("remove", { id: videoId }).finally(() => location.assign(url));
    } else {
      change("remove", { id: videoId });
    }
  }
  list.addEventListener("click", openFromQueue);
  list.addEventListener("auxclick", openFromQueue);

  document.addEventListener("pointerover", (event) => {
    if (!(event.target instanceof Element) || host.contains(event.target) || toolbarHost.contains(event.target)) return;
    const anchor = thumbnailFromTarget(event.target);
    if (anchor) showFloat(anchor, event.clientX, event.clientY);
  }, true);
  document.addEventListener("pointerout", (event) => {
    if (floatSave.hidden || !(event.target instanceof Element)) return;
    if (event.relatedTarget instanceof Node && (hoveredCard?.contains(event.relatedTarget) || host.contains(event.relatedTarget))) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideFloat, 120);
  }, true);
  document.addEventListener("scroll", hideFloat, true);
  window.addEventListener("resize", hideFloat);

  document.addEventListener("click", (event) => {
    if (event.button !== 0 || !event.altKey || event.metaKey || event.ctrlKey || event.shiftKey ||
      !(event.target instanceof Element) || host.contains(event.target) || toolbarHost.contains(event.target)) return;
    const anchor = event.target.closest("a[href]");
    const candidate = anchor && candidateFromAnchor(anchor);
    if (!candidate) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    hideFloat();
    save(candidate);
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) setOpen(false);
  }, true);

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || !changes[STORAGE_KEY]) return;
    const next = changes[STORAGE_KEY].newValue;
    updateCount(Array.isArray(next) ? next.length : 0);
    if (isOpen) {
      queue = Array.isArray(next) ? next : [];
      render();
    }
  });

  send("count")
    .then((result) => {
      if (!result?.ok) throw new Error(result?.error || "Não foi possível carregar a gaveta.");
      updateCount(result.count);
    })
    .catch(() => showToast("Não foi possível carregar a gaveta."));
})();

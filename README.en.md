# Gaveta

![Gaveta brand concept](assets/logo-concept.svg)

**English** · [Português](README.md)

A lightweight, local queue for saving YouTube™ videos without opening dozens of tabs. An independent project by [Evakdo](https://evakdo.com/).

**Status:** beta version 0.5.0. Gaveta is not yet available in the Chrome Web Store. The extension interface is currently in Portuguese; this guide explains the controls in English.

The icon above is an early brand concept.

## Features

- Save a video with the **+** button on its thumbnail, or **Option/Alt + click** a video link.
- Open a collapsible queue inside YouTube.
- Drag videos to reorder them, and remove them with the trash icon.
- Download titles, links, and save dates as a CSV file.
- Keep up to 300 videos in this Chrome profile's local storage.

## Install from GitHub

1. Download this repository as a ZIP and extract it, or clone it.
2. Open `chrome://extensions` in Chrome and turn on **Developer mode**.
3. Click **Load unpacked** and select this folder, the one containing `manifest.json`.
4. Reload any YouTube tabs that were already open.

The **Gaveta** button appears in the YouTube header. Click it to show or hide your queue. Opening a saved video uses the current tab; it stays in the queue until you remove it. **Command/Ctrl + click** still opens a new tab normally.

## Code check

With Node.js installed, run `node tests/background.cjs` to test the queue logic. The extension itself does not need Node.js to run.

## Privacy

Gaveta has no developer server, account, or analytics. It saves only videos you explicitly add using `chrome.storage.local`. When you open the drawer, saved titles and links are rendered inside the YouTube page, and thumbnails are loaded from `i.ytimg.com`. The footer link opens `evakdo.com` only when clicked. Read the [privacy policy](PRIVACY.en.md).

## Before a Chrome Web Store release

- Complete the privacy review of the interface rendered on YouTube.
- Add list import so people can move data from a local installation.
- Finalize the icon, store images, and listing copy.
- Test across YouTube layouts and translate the extension interface into English.

Gaveta is not affiliated with YouTube or Google. YouTube is a trademark of Google LLC.

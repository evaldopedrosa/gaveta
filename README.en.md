# Gaveta

<img src="assets/logo-concept.svg" alt="Gaveta icon" width="72">

**Save videos for later. Close the tabs.**

A queue inside YouTube for people who kept videos open in new tabs just to remember to watch them later. Free, local, and made by [Evakdo](https://evakdo.com/).

[Português](README.md) · **English** · [Watch the illustrated 15-second demo](assets/gaveta-demo.mp4)

![Gaveta in light mode with three sample videos](assets/preview-light.png)

*UI preview on a test page with fictional videos. [See dark mode](assets/preview-dark.png) · [See the empty queue and shortcut](assets/preview-empty.png).*

## How it works

1. On the YouTube home page or in search results, hover over a thumbnail and click **+**. You can also **Option + click** on a Mac, or **Alt + click** elsewhere.
2. Click **Gaveta** in the YouTube header to open the queue. Drag the handle to reorder, download your list as CSV, or remove an item with the trash icon.
3. Click a queued video to watch it. It leaves the queue when opened, including with **Command/Ctrl + click** or a middle click.

On a video page, the drawer says **“Já está na Gaveta”** when that video is already saved. An empty drawer shows the shortcut. Light and dark modes follow your system preference automatically.

## Install in Chrome

Gaveta is in **beta (v0.6.0)** and is not yet in the Chrome Web Store:

1. [Download the repository as a ZIP](https://github.com/evaldopedrosa/gaveta/archive/refs/heads/main.zip) and extract it, or clone the repository.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the extracted folder containing `manifest.json`.
4. Reload any YouTube tabs that were already open.

After updating the files, click **Reload** on the extension card in `chrome://extensions`, then reload your YouTube tabs. Saved links remain in local storage in the same Chrome profile.

## Data and privacy

Gaveta saves **links, titles, and dates**; it does not download videos. The list stays in `chrome.storage.local` in this Chrome profile, with no account, developer server, or analytics. Queue thumbnails load from YouTube when the drawer is open. The limit is 300 videos.

Use **Baixar lista** to export a CSV backup. Uninstalling the extension removes the queue; you can keep the CSV separately. Read the [privacy policy](PRIVACY.en.md).

## Code and limitations

The extension code is in this folder: `content.js` renders the UI and `background.js` manages the queue. If you have Node.js, `node tests/background.cjs` checks the storage logic; Node.js is not needed to use Gaveta.

The UI is currently in Portuguese. YouTube layout changes may require updates to the **+** button. The demo above is an illustrative animation; the screenshots show the actual extension UI on a test page.

Gaveta is an independent project and is not affiliated with YouTube or Google. YouTube is a trademark of Google LLC.

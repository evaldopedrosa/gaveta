# Gaveta

<img src="icons/icon48.png" alt="Gaveta logo" width="48">

A Chrome extension that saves YouTube videos to a local queue, without opening a tab for each one. Free and made by [**Evakdo**](https://evakdo.com/).

**Beta 0.6.1 ·** Not yet available on the Chrome Web Store.

[Português](README.md) · **English**

![Gaveta in light mode](assets/preview-light.png)

*UI preview on a test page with fictional videos. [Dark mode](assets/preview-dark.png) · [Empty queue and shortcut](assets/preview-empty.png) · [Illustrated 15-second demo](assets/gaveta-demo.mp4)*

## Install in Chrome

1. [Download the repository as a ZIP](https://github.com/evaldopedrosa/gaveta/archive/refs/heads/main.zip) and extract it.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the folder containing `manifest.json`.
4. Reload any YouTube tabs that were already open.

To update, replace the files, click **Reload** on Gaveta’s extension card, then reload your YouTube tabs. Your queue stays in the same Chrome profile.

## Use

- On YouTube Home or search results, hover over a thumbnail and click **+**. **Option + click** on Mac or **Alt + click** on other systems also saves the video.
- Click **Gaveta** in the YouTube header to open the queue. Drag videos to reorder, use the trash icon to remove one, or download a CSV copy.
- Opening a video from the queue removes it, including with **Command/Ctrl + click** or a middle click. On a video page, Gaveta indicates when that video is already saved.
- The drawer follows your system’s light or dark appearance and shows the shortcut when the queue is empty.

## Data

The list contains links, titles, and dates and is stored in `chrome.storage.local` in this Chrome profile. Gaveta does not download videos, require an account, or send your list to a developer-owned server. Thumbnails load from YouTube while the queue is open. The limit is 300 videos.

Uninstalling the extension deletes the queue. Export it as a CSV to keep a copy. See the [privacy policy](PRIVACY.en.md).

## Code

`content.js` renders the interface and `background.js` manages the queue. To check the storage logic with Node.js, run `node tests/background.cjs`.

The interface is currently in Portuguese. Changes to YouTube’s layout may require updates to thumbnail detection. Gaveta is an independent project and is not affiliated with YouTube or Google.

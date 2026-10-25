# Z.AI CopyCode — One-Click Copy for Code Blocks

> A lightweight Chrome / Edge browser extension that adds a **Copy** button to every code block and CodeMirror editor on [z.ai](https://z.ai). No account, no tracking, no nonsense.

---

## ✨ Features

- ⚡ **One-click copy** — hover over any code block and hit Copy
- 🎯 **Smart detection** — targets real code blocks (`pre`, syntax-highlighted, CodeMirror), ignores inline code
- 🔒 **Privacy first** — zero network requests, zero telemetry, zero external dependencies
- 🎨 **Minimal UI** — frosted-glass button that appears on hover, disappears when not needed
- ✅ **Visual feedback** — button flashes green and says "Copied!" for 2 seconds

---

## 🚀 Installation (Developer Mode — takes 30 seconds)

> No Chrome Web Store listing needed. Load it directly.

### Chrome
1. Download this repo — click the green **Code** button → **Download ZIP**, then unzip it
2. Open a new tab and go to `chrome://extensions`
3. Toggle **Developer mode** ON (top-right corner)
4. Click **Load unpacked**
5. Select the **`copycode-extension`** folder inside the unzipped download
6. Done — the extension is now active on z.ai

### Microsoft Edge
1. Same steps, but go to `edge://extensions` instead
2. Enable **Developer mode** (left sidebar)
3. Click **Load unpacked** → select the **`copycode-extension`** folder

---

## 🗂️ Folder Structure

```
Z.AI-COPY-CODE/
├── copycode-extension/       ← Load THIS folder as the unpacked extension
│   ├── manifest.json
│   ├── content.js
│   └── icons/
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── manifest.json             ← Root manifest (reference copy)
├── README.md
└── .gitignore
```

---

## 🔧 How It Works

The extension injects a single content script (`content.js`) into z.ai pages. It:

1. Scans the page for `.cm-editor` elements (CodeMirror) and `<pre>` code blocks
2. Attaches a styled **Copy** button to each one
3. Uses a `MutationObserver` to catch dynamically-loaded content
4. On click, reads the text via the CodeMirror state API (or `textContent` fallback) and writes to the clipboard via `navigator.clipboard`

No iframes, no eval, no remote fetches — everything runs locally inside the page.

---

## 🛡️ Permissions

| Permission | Why it's needed |
|---|---|
| `clipboardWrite` | Write copied text to the clipboard |
| Host: `https://z.ai/*` | Inject the copy button only on z.ai |

That's it. No `tabs`, no `storage`, no `identity`, no broad host permissions.

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| Button doesn't appear | Make sure you loaded the `copycode-extension` subfolder, not the root folder |
| "Load unpacked" is greyed out | Enable Developer mode first (toggle in top-right) |
| Works on old tabs but not new ones | Reload the tab after installing |
| Copy does nothing | Check that your browser allows clipboard access on z.ai |

---

## 🤝 Contributing

PRs and issues are welcome. Please keep contributions minimal and privacy-respecting — no new permissions, no external requests.

---

## 📄 License

MIT — free to use, fork, and modify.

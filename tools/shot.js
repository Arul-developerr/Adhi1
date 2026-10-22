// CDP screenshot helper: launches headless Chrome, waits for network + animation
// settle, then captures a full-page PNG. Uses only Node built-ins.
//
//   node tools/shot.js <url> <out.png> [width] [height] [theme] [fullPage]

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CHROME =
    process.env.CHROME_PATH ||
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const [, , url, out, wArg, hArg, theme, fullArg, scrollArg] = process.argv;
const width = Number(wArg || 1440);
const height = Number(hArg || 900);
const fullPage = fullArg !== "false" && fullArg !== "viewport";
const scrollY = Number(scrollArg || 0);

const userDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-"));
const port = 9222 + Math.floor(Math.random() * 500);

const chrome = spawn(
    CHROME,
    [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        "--force-color-profile=srgb",
        "--font-render-hinting=none",
        `--user-data-dir=${userDir}`,
        `--remote-debugging-port=${port}`,
        `--window-size=${width},${height}`,
        "about:blank",
    ],
    { stdio: "ignore" }
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function findTarget() {
    for (let i = 0; i < 60; i++) {
        try {
            const res = await fetch(`http://127.0.0.1:${port}/json/list`);
            const list = await res.json();
            const page = list.find((t) => t.type === "page");
            if (page) return page;
        } catch {}
        await sleep(250);
    }
    throw new Error("Chrome did not expose a debugging target");
}

(async () => {
    const target = await findTarget();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();

    const send = (method, params = {}) =>
        new Promise((resolve, reject) => {
            const msgId = ++id;
            pending.set(msgId, { resolve, reject });
            ws.send(JSON.stringify({ id: msgId, method, params }));
        });

    await new Promise((res, rej) => {
        ws.onopen = res;
        ws.onerror = rej;
    });

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && pending.has(msg.id)) {
            const { resolve, reject } = pending.get(msg.id);
            pending.delete(msg.id);
            msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
        }
    };

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width < 768,
    });

    if (theme === "light") {
        // next-themes is configured with defaultTheme="dark", so emulating
        // prefers-color-scheme has no effect. The resolved theme comes from
        // the persisted localStorage key, so seed it before any script runs.
        await send("Page.addScriptToEvaluateOnNewDocument", {
            source: `try { localStorage.setItem("theme", "light"); } catch (e) {}`,
        });
        await send("Emulation.setEmulatedMedia", {
            features: [{ name: "prefers-color-scheme", value: "light" }],
        });
    }

    await send("Page.navigate", { url });
    await sleep(400);

    // Wait for the document to be interactive and fonts ready.
    for (let i = 0; i < 40; i++) {
        const { result } = await send("Runtime.evaluate", {
            expression: "document.readyState",
            returnByValue: true,
        });
        if (result.value === "complete") break;
        await sleep(150);
    }
    await send("Runtime.evaluate", {
        expression: "document.fonts && document.fonts.ready ? 'document.fonts.ready' : 'ok'",
        awaitPromise: true,
    });

    // Size the viewport to the full document, then RELOAD so that charts
    // animate exactly once at their final dimensions. Resizing after the
    // first paint restarts Recharts animations and yields a partial capture.
    if (fullPage) {
        const { result } = await send("Runtime.evaluate", {
            expression:
                "JSON.stringify({w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight})",
            returnByValue: true,
        });
        const box = JSON.parse(result.value);
        await send("Emulation.setDeviceMetricsOverride", {
            width: box.w,
            height: box.h,
            deviceScaleFactor: 1,
            mobile: width < 768,
        });
        await sleep(500);
        await send("Page.reload", { ignoreCache: false });
        await sleep(1200);
        for (let i = 0; i < 40; i++) {
            const { result } = await send("Runtime.evaluate", {
                expression: "document.readyState",
                returnByValue: true,
            });
            if (result.value === "complete") break;
            await sleep(150);
        }
    }

    // Let entrance animations and chart transitions finish.
    await sleep(4500);

    if (scrollY > 0) {
        await send("Runtime.evaluate", {
            expression: `window.scrollTo(0, ${scrollY})`,
        });
        await sleep(1200);
    }

    // Freeze CSS animations/transitions so the capture is deterministic.
    await send("Runtime.evaluate", {
        expression: `
            (() => {
                const s = document.createElement('style');
                s.textContent = '*,*::before,*::after{animation-play-state:paused !important;transition:none !important}';
                document.head.appendChild(s);
                return true;
            })()
        `,
    });
    await sleep(500);

    // NOTE: captureBeyondViewport must stay false. Chrome re-renders the
    // page when it captures beyond the viewport, which restarts the Recharts
    // bar animation at zero height and yields a capture with no bars. The
    // viewport was already resized to the full document above, so a plain
    // viewport capture is the full page.
    const { data } = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
    });

    fs.writeFileSync(out, Buffer.from(data, "base64"));
    console.log(`saved ${out}`);

    ws.close();
    chrome.kill();
    try {
        fs.rmSync(userDir, { recursive: true, force: true });
    } catch {}
    process.exit(0);
})().catch((err) => {
    console.error("FAILED:", err.message);
    chrome.kill();
    process.exit(1);
});

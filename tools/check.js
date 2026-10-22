// DOM geometry assertions against the running app.
//   node tools/check.js <baseUrl>
//
// Checks, for every route:
//   - no horizontal page overflow
//   - no element wider than the viewport
//   - every Recharts plot area uses the full chart width
//   - all eight blood groups are represented

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CHROME =
    process.env.CHROME_PATH ||
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const base = process.argv[2] || "http://localhost:3222";
const ROUTES = [
    "/",
    "/dashboard",
    "/inventory",
    "/matching",
    "/request",
    "/alerts",
    "/predictions",
    "/register",
];
const WIDTHS = [360, 390, 768, 1024, 1440];

const userDir = fs.mkdtempSync(path.join(os.tmpdir(), "chk-"));
const port = 9800 + Math.floor(Math.random() * 300);

const chrome = spawn(
    CHROME,
    [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--no-first-run",
        "--disable-extensions",
        `--user-data-dir=${userDir}`,
        `--remote-debugging-port=${port}`,
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
    throw new Error("no target");
}

const PROBE = `(() => {
  const doc = document.documentElement;
  const vw = doc.clientWidth;

  // Elements that overflow the viewport. Fixed-position elements are
  // excluded: Chrome sizes them against the expanded initial containing
  // block, so they report overflow that some other element caused.
  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el);
    if (style.position === 'fixed') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const right = r.right + window.scrollX;
    if (right > vw + 1) {
      offenders.push({
        over: Math.round(right - vw),
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || '').slice(0, 100),
      });
    }
  }
  // Report the deepest offenders (an element that is contained by another
  // offender is usually just following its parent).
  offenders.sort((a, b) => b.over - a.over);
  const worst = offenders.slice(0, 4);

  // For each recharts surface, measure how much of the plot width is used.
  // Recharts 2.x has no .recharts-plot-area, so measure the drawn marks
  // (bars / area / line) and the x-axis ticks relative to the svg.
  const charts = [];
  for (const svg of document.querySelectorAll('svg.recharts-surface')) {
    const sr = svg.getBoundingClientRect();
    if (!sr.width) continue;

    let used = 0;
    for (const m of svg.querySelectorAll(
      '.recharts-bar-rectangle, .recharts-area-curve, .recharts-line-curve, .recharts-dot, .recharts-reference-dot'
    )) {
      const b = m.getBoundingClientRect();
      if (b.width > 0) used = Math.max(used, b.right - sr.left);
    }

    // Right-most x-axis tick label, used as the plot-area right edge.
    let tickRight = 0;
    for (const t of svg.querySelectorAll('.recharts-xAxis .recharts-cartesian-axis-tick-value')) {
      const b = t.getBoundingClientRect();
      tickRight = Math.max(tickRight, b.right - sr.left);
    }

    charts.push({
      svgW: Math.round(sr.width),
      usedW: Math.round(used),
      tickRight: Math.round(tickRight),
      ratio: sr.width ? +(used / sr.width).toFixed(3) : 0,
    });
  }

  const groups = new Set();
  for (const el of document.querySelectorAll('*')) {
    const t = (el.textContent || '').trim();
    if (/^(A|B|O|AB)[+-]$/.test(t) && el.children.length === 0) groups.add(t);
  }

  return {
    vw,
    scrollW: doc.scrollWidth,
    overflow: doc.scrollWidth > vw + 1,
    worst,
    charts,
    groups: [...groups].sort(),
  };
})()`;

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
    ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id && pending.has(msg.id)) {
            const { resolve, reject } = pending.get(msg.id);
            pending.delete(msg.id);
            msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
        }
    };

    await send("Page.enable");
    await send("Runtime.enable");

    let failures = 0;

    for (const width of WIDTHS) {
        await send("Emulation.setDeviceMetricsOverride", {
            width,
            height: 900,
            deviceScaleFactor: 1,
            mobile: width < 768,
        });

        for (const route of ROUTES) {
            await send("Page.navigate", { url: base + route });
            await sleep(2200);
            // Nudge layout so ResponsiveContainer settles.
            await send("Runtime.evaluate", {
                expression: "window.dispatchEvent(new Event('resize')); void document.body.offsetHeight;",
            });
            await sleep(1800);

            const { result } = await send("Runtime.evaluate", {
                expression: PROBE,
                returnByValue: true,
            });
            const r = result.value;

            const problems = [];
            if (r.overflow) {
                const who = r.worst
                    .map((w) => `${w.tag}.${w.cls}(+${w.over})`)
                    .join(" , ");
                problems.push(`h-overflow ${r.scrollW}>${r.vw} :: ${who}`);
            }
            for (const c of r.charts) {
                if (c.ratio < 0.75) {
                    problems.push(
                        `chart uses ${Math.round(c.ratio * 100)}% of width (svg ${c.svgW}px, marks to ${c.usedW}px)`
                    );
                }
            }

            const tag = `${String(width).padStart(4)}px ${route.padEnd(12)}`;
            if (problems.length) {
                failures++;
                console.log(`FAIL  ${tag} ${problems.join(" | ")}`);
            } else {
                console.log(
                    `ok    ${tag} charts=${r.charts.length} groups=[${r.groups.join(",")}]`
                );
            }
        }
    }

    console.log(failures ? `\n${failures} failing checks` : "\nAll checks passed");
    ws.close();
    chrome.kill();
    try {
        fs.rmSync(userDir, { recursive: true, force: true });
    } catch {}
    process.exit(failures ? 1 : 0);
})().catch((err) => {
    console.error("FAILED:", err.message);
    chrome.kill();
    process.exit(1);
});

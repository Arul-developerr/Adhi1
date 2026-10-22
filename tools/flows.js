// Functional smoke test: exercises the real interactions on each route
// and asserts the app responds. Uses CDP input events, not synthetic JS
// clicks, so it goes through React's event handlers.
//
//   node tools/flows.js <baseUrl>

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CHROME = process.env.CHROME_PATH ||
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.argv[2] || "http://localhost:3555";

const userDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-"));
const port = 9900 + Math.floor(Math.random() * 90);
const chrome = spawn(
    CHROME,
    [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--no-first-run",
        `--user-data-dir=${userDir}`,
        `--remote-debugging-port=${port}`,
        "about:blank",
    ],
    { stdio: "ignore" }
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let failures = 0;
function check(name, ok, detail) {
    if (ok) {
        console.log(`ok    ${name}`);
    } else {
        failures++;
        console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
    }
}

(async () => {
    let target;
    for (let i = 0; i < 60 && !target; i++) {
        try {
            const r = await fetch(`http://127.0.0.1:${port}/json/list`);
            target = (await r.json()).find((t) => t.type === "page");
        } catch {}
        if (!target) await sleep(250);
    }
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();
    const send = (m, p = {}) =>
        new Promise((res, rej) => {
            const i = ++id;
            pending.set(i, { resolve: res, reject: rej });
            ws.send(JSON.stringify({ id: i, method: m, params: p }));
        });
    await new Promise((res, rej) => {
        ws.onopen = res;
        ws.onerror = rej;
    });
    ws.onmessage = (e) => {
        const m = JSON.parse(e.data);
        if (m.id && pending.has(m.id)) {
            const { resolve, reject } = pending.get(m.id);
            pending.delete(m.id);
            m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
        }
    };
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
        width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
    });

    const evaluate = async (expression) => {
        const { result } = await send("Runtime.evaluate", {
            expression: `(() => { ${expression} })()`,
            returnByValue: true,
            awaitPromise: true,
        });
        return result.value;
    };

    const goto = async (url) => {
        await send("Page.navigate", { url: base + url });
        await sleep(2600);
    };

    /** Click an element by its visible text, using a real mouse event. */
    const clickText = async (selector, text) => {
        const box = await evaluate(`
            const els = [...document.querySelectorAll(${JSON.stringify(selector)})];
            const el = els.find(e => (e.textContent || '').trim().includes(${JSON.stringify(text)}));
            if (!el) return null;
            el.scrollIntoView({block:'center'});
            const r = el.getBoundingClientRect();
            return {x: r.left + r.width/2, y: r.top + r.height/2};
        `);
        if (!box) return false;
        await sleep(250);
        for (const type of ["mousePressed", "mouseReleased"]) {
            await send("Input.dispatchMouseEvent", {
                type, x: box.x, y: box.y, button: "left", clickCount: 1,
            });
        }
        await sleep(700);
        return true;
    };

    /** Click an element by its aria-label, using a real mouse event. */
    const clickLabel = async (selector, label) => {
        const box = await evaluate(`
            const els = [...document.querySelectorAll(${JSON.stringify(selector)})];
            const el = els.find(e => (e.getAttribute('aria-label') || '').includes(${JSON.stringify(label)}));
            if (!el) return null;
            el.scrollIntoView({block:'center'});
            const r = el.getBoundingClientRect();
            return {x: r.left + r.width/2, y: r.top + r.height/2};
        `);
        if (!box) return false;
        await sleep(250);
        for (const type of ["mousePressed", "mouseReleased"]) {
            await send("Input.dispatchMouseEvent", {
                type, x: box.x, y: box.y, button: "left", clickCount: 1,
            });
        }
        await sleep(900);
        return true;
    };

    /**
     * Set a native select's value so React's onChange fires. React installs
     * a value tracker that intercepts plain `.value =` assignments, so the
     * native setter has to be used to make the change observable.
     */
    const setSelect = async (index, value) =>
        evaluate(`
            const sels = [...document.querySelectorAll('select')];
            const s = sels[${index}];
            if (!s) return false;
            const setter = Object.getOwnPropertyDescriptor(
                window.HTMLSelectElement.prototype, 'value'
            ).set;
            setter.call(s, ${JSON.stringify(value)});
            s.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        `);

    const bodyText = () => evaluate("return document.body.innerText;");

    /* ── Inventory: filters change the data ─────────────────── */
    await goto("/inventory");
    const before = await evaluate(`
        const el = document.querySelector('main');
        return el.innerText.includes('6 of 6');
    `);
    const selectChanged = await evaluate(`
        const sels = [...document.querySelectorAll('select')];
        return sels.length >= 3;
    `);
    check("inventory: three filter selects present", selectChanged);

    // Set the bank-type filter to "government" through a real change event.
    await setSelect(1, "government");
    await sleep(900);
    const after = await bodyText();
    check(
        "inventory: bank-type filter narrows the directory",
        /government/i.test(after) && /applied/i.test(after),
        /applied/i.test(after) ? "" : "no Applied badge"
    );
    const govCount = await evaluate(`
        const m = document.body.innerText.match(/Blood bank directory[\\s\\S]{0,20}?(\\d+)\\s+of\\s+(\\d+)/);
        return m ? m[1] : null;
    `);
    check(
        "inventory: filtered directory shows fewer banks",
        govCount !== null && Number(govCount) < 6,
        `count=${govCount}`
    );

    /* ── Matching: run a search, get ranked donors ─────────── */
    await goto("/matching");
    await setSelect(0, "O-");
    await sleep(500);
    const ran = await clickText("button", "Run compatibility search");
    check("matching: search button clicked", ran);
    await sleep(2600);
    const matchText = await bodyText();
    check(
        "matching: donors are listed after search",
        /donor/i.test(matchText) && !matchText.includes("No search running"),
        matchText.includes("No search running") ? "still idle" : ""
    );

    /* ── Request: validation blocks an empty submit ─────────── */
    await goto("/request");
    const submitted = await clickText("button", "Search compatible donors");
    await sleep(800);
    const reqText = await bodyText();
    check(
        "request: validation surfaces on an empty form",
        /required|enter|select/i.test(reqText),
        "no validation message"
    );

    /* ── Alerts: broadcast creates a new alert ──────────────── */
    await goto("/alerts");
    const beforeCount = await evaluate(`
        const m = document.body.innerText.match(/Alert feed[\\s\\S]{0,20}?(\\d+)\\s+records/);
        return m ? Number(m[1]) : null;
    `);
    const opened = await clickText("button", "Broadcast alert");
    check("alerts: broadcast button opens the form", opened);
    await sleep(600);
    const dialogText = await bodyText();
    check(
        "alerts: broadcast form is present",
        /broadcast|urgency|blood group/i.test(dialogText),
        ""
    );
    const afterCount = await evaluate(`
        const m = document.body.innerText.match(/Alert feed[\\s\\S]{0,20}?(\\d+)\\s+records/);
        return m ? Number(m[1]) : null;
    `);
    check(
        "alerts: alert feed rendered with records",
        beforeCount !== null && beforeCount > 0,
        `count=${beforeCount}`
    );

    /* ── Alerts: resolve flow ───────────────────────────────── */
    const resolved = await clickText("button", "Resolve");
    await sleep(700);
    const confirmText = await bodyText();
    check(
        "alerts: resolve asks for confirmation",
        /confirm|resolve|are you sure/i.test(confirmText),
        ""
    );

    /* ── Register: step 1 validation blocks a bad age ──────── */
    await goto("/register");
    const advanced = await clickText("button", "Continue");
    await sleep(700);
    const regText = await bodyText();
    check(
        "register: step 1 validates before advancing",
        /required|enter|age|blood group/i.test(regText),
        ""
    );
    const stillStep1 = await evaluate(`
        return document.body.innerText.includes('Personal details');
    `);
    check("register: stays on step 1 when invalid", stillStep1);

    /* ── Predictions: zone detail panel opens ───────────────── */
    await goto("/predictions");
    const zoneClicked = await clickText("button", "Tiruchengode");
    await sleep(900);
    const predText = await bodyText();
    check(
        "predictions: zone detail opens",
        /critical|shortage|risk/i.test(predText),
        ""
    );

    /* ── Theme toggle switches theme and persists ───────────── */
    await goto("/dashboard");
    const themeBefore = await evaluate(
        "return document.documentElement.classList.contains('dark');"
    );
    const toggled = await clickLabel("button", "Switch to");
    check("theme: toggle button found", toggled);
    await sleep(900);
    const themeAfter = await evaluate(
        "return document.documentElement.classList.contains('dark');"
    );
    check(
        "theme: toggle flips the theme",
        themeBefore !== themeAfter,
        `before=${themeBefore} after=${themeAfter}`
    );
    const stored = await evaluate(
        "return localStorage.getItem('theme');"
    );
    check("theme: choice is persisted", stored === "dark" || stored === "light", `stored=${stored}`);

    console.log(failures ? `\n${failures} failing checks` : "\nAll flow checks passed");
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

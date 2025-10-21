// chrome.webNavigation.onCommitted.addListener(async (details) => {
//     const url = details.url;

//     if (!/^https?:\/\//i.test(url)) return;

//     try {
//         const allowlist = await chrome.storage.local.get(url);
//         if (allowlist[url]) return; // skip if allowed

//         const response = await fetch("http://127.0.0.1:8000/v1/check", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ url })
//         });

//         if (!response.ok) return;

//         const data = await response.json();

//         if (data.verdict === "phishing") {
//             chrome.tabs.update(details.tabId, {
//                 url: chrome.runtime.getURL("block.html") + "?blockedUrl=" + encodeURIComponent(url)
//             });
//         }

//     } catch (err) {
//         console.error("PhishGuard AI error:", err);
//     }
// });
// Allowlist of safe domains
const safeDomains = ["chrome://", "about:", "localhost", "127.0.0.1", "chrome-extension://"];

chrome.webNavigation.onCommitted.addListener(async (details) => {
    const url = details.url;
    
    // Skip non-http(s) or safe domains
    if (!/^https?:\/\//i.test(url) || safeDomains.some(d => url.startsWith(d))) return;

    try {
        // Check if URL is in allowlist
        const allowlist = await chrome.storage.local.get(url);
        if (allowlist[url]) return; // skip if already allowed

        // Call AI API
        const response = await fetch("http://127.0.0.1:8000/v1/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        if (!response.ok) return;

        const data = await response.json();

        // Log for debugging
        console.log("PhishGuard check:", url, "Score:", data.score, "Verdict:", data.verdict);

        // Block only if strongly predicted phishing
        if (data.verdict === "phishing" && data.score >= 0.6) {
            chrome.tabs.update(details.tabId, {
                url: chrome.runtime.getURL("block.html") + "?blockedUrl=" + encodeURIComponent(url)
            });
        }

    } catch (err) {
        console.error("PhishGuard AI error:", err);
    }
});

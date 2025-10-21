// block.js
const params = new URLSearchParams(location.search);
const blockedUrl = params.get("blockedUrl");

if (blockedUrl) document.getElementById("url").textContent = blockedUrl;

// Allow once
document.getElementById("allowOnce").addEventListener("click", () => {
    if (blockedUrl) {
        chrome.tabs.update({ url: blockedUrl }); // open in current tab
    }
});

// Always allow
document.getElementById("allowForever").addEventListener("click", () => {
    if (blockedUrl) {
        chrome.storage.local.set({ [blockedUrl]: true }, () => {
            chrome.tabs.update({ url: blockedUrl }); // redirect after saving
        });
    }
});

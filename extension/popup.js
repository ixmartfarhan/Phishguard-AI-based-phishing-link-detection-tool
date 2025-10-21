async function checkURL(url){
    try {
        const resp = await fetch("http://127.0.0.1:8000/v1/check", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({url})
        });

        if (!resp.ok){
            document.getElementById("result").innerText = `Error: ${resp.status}`;
            return;
        }

        const data = await resp.json();
        document.getElementById("result").innerText =
            `Verdict: ${data.verdict}\nScore: ${Math.round(data.score*100)}%\nExplanation: ${JSON.stringify(data.explanation)}`;

    } catch (err) {
        document.getElementById("result").innerText = "Server error or not running!";
        console.error(err);
    }
}

document.getElementById("check").addEventListener("click", () => {
    const url = document.getElementById("urlInput").value;
    if(url) checkURL(url);
});

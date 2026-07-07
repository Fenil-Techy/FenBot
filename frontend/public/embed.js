(function () {
    var script = document.currentScript;
    var apiKey = script.getAttribute("data-api-key");
    var widgetOrigin = "http://localhost:3000"
    if (!apiKey) {
        console.error("FenBot: missing data-api-key on embed script tag");
        return;
    }

    var iframe = document.createElement("iframe");
    iframe.src = widgetOrigin + "/widget?key=" + encodeURIComponent(apiKey);
    iframe.style.position = "fixed";
    iframe.style.bottom = "0";
    iframe.style.right = "0";
    iframe.style.width = "120px";   // closed size = just the launcher button
    iframe.style.height = "120px";
    iframe.style.border = "none";
    iframe.style.zIndex = "999999";
    iframe.style.background = "transparent";
    iframe.setAttribute("allowtransparency", "true");
    iframe.title = "Chat widget";

    document.body.appendChild(iframe);

    window.addEventListener("message", function (event) {
        if (event.origin !== widgetOrigin) return;
        if (event.data && event.data.type === "fenbot:toggle") {
            if (event.data.open) {
                iframe.style.width = "460px";
                iframe.style.height = "720px";
            } else {
                iframe.style.width = "120px";
                iframe.style.height = "120px";
            }
        }
    });
})();
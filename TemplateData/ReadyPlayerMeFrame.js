function setupRpmFrame(subdomain) {
    rpmFrame.src = `https://${subdomain !== "" ? subdomain : "demo"}.readyplayer.me/avatar?frameApi`
    window.addEventListener("message", subscribe);
    document.addEventListener("message", subscribe);
    function subscribe(event) {
        const json = parse(event);
        if (
            unityGame == null ||
            json?.source !== "readyplayerme" ||
            json?.eventName == null
        ) {
            return;
        }
        unityGame.SendMessage(
            "DebugPanel",
            "LogMessage",
            `Event: ${json.eventName}`
        );

        // Susbribe to all events sent from Ready Player Me once frame is ready
        if (json.eventName === "v1.frame.ready") {
            rpmFrame.contentWindow.postMessage(
                JSON.stringify({
                    target: "readyplayerme",
                    type: "subscribe",
                    eventName: "v1.**",
                }),
                "*"
            );
        }

        // Get avatar GLB URL
        if (json.eventName === "v1.avatar.exported") {
            rpmContainer.style.display = "none";
            unityGame.SendMessage(
                "WebAvatarLoader",
                "OnWebViewAvatarGenerated",
                json.data.url
            );
            console.log(`Avatar URL: ${json.data.url}`);
        }

        // Get user id
        if (json.eventName === "v1.user.set") {
            console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
        }
    }

    function parse(event) {
        try {
            return JSON.parse(event.data);
        } catch (error) {
            return null;
        }
    }
}

function displayRpm() {
    rpmContainer.style.display = "block";
}

function hideRpm() {
    rpmContainer.style.display = "none";
}

function showFullscreen(){
    canvasWrapper.requestFullscreen();
}
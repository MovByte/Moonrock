let player = window.RufflePlayer.newest().createPlayer();
        let gamePath = localStorage.getItem('gamePath');
        let provider = localStorage.getItem('provider');
        let zipPath = undefined;
        if (gamePath === null || provider === null) {
            alert('Please pick a game first.');
            location.href = '/';
        }
        if (localStorage.getItem('provider') === "flashpoint") {
            zipPath = localStorage.getItem('zipPath');
            document.getElementById("zipFlashpoint").style.display = "block";
            document.getElementById("flashpointZip").value = localStorage.getItem("useFlashpointZip") || "false";
        }
        document.getElementById("flashpointZip").addEventListener("change", function() {
            localStorage.setItem("useFlashpointZip", document.getElementById("flashpointZip").value);
            location.reload();
        });
        player.config.base = gamePath.substring(0, gamePath.lastIndexOf('/') + 1);
        player.config.allowScriptAccess = true;
        document.querySelector("#player").append(player);
        if (provider === "flashpoint" && localStorage.getItem('useFlashpointZip') === "true") {
            (async () => {
                try {
                    if (zipPath === undefined) {
                        throw new Error('Zip path not found in localStorage.');
                        alert('An error occurred.');
                    }
                    const zip = await JSZip.loadAsync(await fetch(`proxy/?url=${zipPath}`).then(r => r.blob()));
                    console.log(Object.keys(zip.files));
                    const gameFileData = await zip.file(`content/${new URL(gamePath).hostname}${new URL(gamePath).pathname}`);
                    console.log(`Searching for: content/${new URL(gamePath).hostname}${new URL(gamePath).pathname}`);
                    if (gameFileData === null) {
                        throw new Error(`File not found in zip: ${zipPath}`);
                        alert('An error occurred.');
                    }
                    const gameBlobUrl = URL.createObjectURL(await gameFileData.async('blob'));
                    player.load(gameBlobUrl);
                } catch (error) {
                    console.error(error);
                    alert('An error occurred.');
                };
            })();
        //} else if (zipPath !== undefined) {
        //    player.load(gamePath);
        } else {
            player.load(gamePath);
        }
        player.addEventListener('loadedmetadata', () => {
            if (player.metadata.width > 1 && player.metadata.height > 1) {
                player.style.width  = player.metadata.width  + 'px';
                player.style.height = player.metadata.height + 'px';
            }
        });
        function fullscreen() {
            player.requestFullscreen();
        };
    document.getElementById("flashpointZip").value = localStorage.getItem("useFlashpointZip");
    function update(event) {
        event.preventDefault();
        useflashpointzip = document.getElementById("flashpointZip").value
        if (useflashpointzip === "true") {
            localStorage.setItem("useflashpointzip", "true");
            alert("Saved!")
        } else if (useflashpointzip === "false") {
            localStorage.setItem("useflashpointzip", "false");
            alert("Saved!")
        } else {
            alert("An error occurred. Please try again.")
            console.log(useflashpointzip)
        }
    }
    document.getElementById("settings").addEventListener("change", update);

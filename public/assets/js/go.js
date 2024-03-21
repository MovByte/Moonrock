window.onload = function() {
    let URL = localStorage.getItem("URL");
    document.querySelector("#iframeid").src = URL;
}
function fullscreen() {
    let iframe = document.querySelector("#iframeid");
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
}

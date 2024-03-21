function go() {
    localStorage.setItem('URL', document.getElementById("URL").value);
    window.location.href = 'go.html';
};
function flash() {
    localStorage.setItem('gamePath', document.getElementById("gamePath").value);
    window.location.href = 'flash.html';
};
function provider() {
    localStorage.setItem('provider', document.getElementById("provider").value);
};
function zip() {
    localStorage.setItem('zipPath', document.getElementById("zipPath").value);
}
document.getElementById("provider").value = localStorage.getItem('provider') || '';
document.getElementById("URL").value = localStorage.getItem('URL') || '';
document.getElementById("gamePath").value = localStorage.getItem('gamePath') || '';
document.getElementById("zipPath").value = localStorage.getItem('zipPath') || '';
document.addEventListener('DOMContentLoaded', function () {
    // Load Header
    const headerContainer = document.getElementById('header-container');
    fetch('assets/common/header.html')
        .then(response => response.text())
        .then(html => {
            headerContainer.innerHTML = html;
        })
        .catch(error => console.error('Error loading header:', error));

    // Load Footer
    const footerContainer = document.getElementById('footer-container');
    fetch('assets/common/footer.html')
        .then(response => response.text())
        .then(html => {
            footerContainer.innerHTML = html;
        })
        .catch(error => console.error('Error loading footer:', error));
});

// Function to update background position based on scroll
function updateBackgroundPosition() {
    var scrollTop = window.scrollY;
    var scrollSpeed = 0.3; // Adjust this value to change the scrolling speed
    var backgroundPosition = 'center ' + (-scrollTop * scrollSpeed) + 'px';
    document.body.style.backgroundPosition = backgroundPosition;
}

// Function to handle scroll event
function handleScroll() {
    requestAnimationFrame(updateBackgroundPosition);
}

// Initialize background position
updateBackgroundPosition();

// Add scroll event listener
document.addEventListener("scroll", handleScroll);

document.addEventListener('DOMContentLoaded', () => {
    window.searchGames = async (event) => {
        event.preventDefault();

        const searchTerm = document.querySelector('.search-bar input').value;
        if (searchTerm.trim() === '') {
            return;
        }
        try {
            const response = await fetch(`/search?q=${searchTerm}`);
            const searchResults = await response.json();
            console.log(searchResults);
            displaySearchResults(searchResults);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };
    const displaySearchResults = (results) => {
        const searchResultsSection = document.getElementById('search-results');
        searchResultsSection.innerHTML = '';

        if (results.length > 0) {
            results.forEach(result => {
                const gameElement = document.createElement('div');
                gameElement.classList.add('search-result');
                gameElement.innerHTML = `
                    <h3>${result.title}</h3>
                    <!--<p>Mobile Friendly: ${result.mobileFriendly}</p>-->
                    <!--<p>Age Rating: ${result.ageRating}</p>-->
                    <a href="${result.directLink}" target="_blank">Play Game</a>
                    <img src="${result.cover}" alt="${result.title} Cover">
                `;
                searchResultsSection.appendChild(gameElement);
            });
        } else {
            searchResultsSection.innerHTML = '<p>No results found.</p>';
        }
    };
});
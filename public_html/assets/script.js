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
        if (localStorage.getItem('view') === 'list') {
            searchResultsSection.style.display = 'block';
        }
        searchResultsSection.innerHTML = '';

        if (results.length > 0) {
            results.forEach(result => {
                const gameElement = document.createElement('div');
                gameElement.classList.add('search-result');
                if (result.getInfo != null) {
                    gameElement.innerHTML = `
                        <h3>${result.title}</h3>
                        <!--<p>Mobile Friendly: ${result.mobileFriendly}</p>-->
                        <!--<p>Age Rating: ${result.ageRating}</p>-->
                        <a onclick="playFlashpoint('${result.id}', '${result.title}')" target="_blank">Play Game</a>
                        <img loading="lazy" src="${result.cover}" alt="${result.title} Cover">
                    `;
                    searchResultsSection.appendChild(gameElement);
                    return;
                //} else if (result.apeRating != null) {
                //    gameElement.innerHTML = `
                //    <h3>${result.title}</h3>
                //    <!--<p>Mobile Friendly: ${result.mobileFriendly}</p>-->
                //    <!--<p>Age Rating: ${result.ageRating}</p>-->
                //    <a onclick="playYandex('${result.id}')" target="_blank">Play Game</a>
                //    <img loading="lazy" src="${result.cover}" alt="${result.title} Cover">
                //`;
                } else {
                    gameElement.innerHTML = `
                    <h3>${result.title}</h3>
                    <!--<p>Mobile Friendly: ${result.mobileFriendly}</p>-->
                    <!--<p>Age Rating: ${result.ageRating}</p>-->
                    <a onclick="playGame('${result.directLink}', '${result.title}')" target="_blank">Play Game</a>
                    <img loading="lazy" src="${result.cover}" alt="${result.title} Cover">
                `;
                }
                searchResultsSection.appendChild(gameElement);
            });
        } else {
            searchResultsSection.innerHTML = '<p>No results found.</p>';
        }
    };
});
function playGame(url, gameName) {
    if (localStorage.getItem('userId') != null) {
        fetch(`play?userId=${localStorage.getItem('userId')}&gameName=${gameName}`);
    };
    localStorage.setItem('URL', url);
    window.location.href = 'go.html';
}
async function playFlashpoint(id, gameName) {
    if (localStorage.getItem('userId') != null) {
        fetch(`play?userId=${localStorage.getItem('userId')}&gameName=${gameName}`);
    };
    const get = `flash?id=${id}`;
    f = fetch(get)
        .then(async response => {
            if (response.status == 404) {
                alert('Game not found. Please report this to the developer.');
            } else {
                gamePath = await response.json();
                localStorage.setItem('gamePath', gamePath);
                window.location.href = 'flash.html';
            }
        });
};
//async function playYandex(id) {
//    const get = `yandex?appID=${id}`;
//    f = fetch(get)
//        .then(async response => {
//            if (response.status == 404) {
//                alert('Game not found. Please report this to the developer.');
//            } else {
//                gamePath = await response.json();
//                localStorage.setItem('gamePath', gamePath);
//                window.location.href = 'go.html';
//            }
//        });
//}
document.addEventListener('DOMContentLoaded', () => {
    //localStorage.removeItem('gamePath');
    //localStorage.removeItem('zipPath');
    //localStorage.removeItem('URL');
    //localStorage.removeItem('provider');
    window.searchGames = async (event) => {
        event.preventDefault();

        const searchTerm = document.querySelector('.search-bar input').value;
        if (searchTerm.trim() === '') {
            return;
        }
        try {
            const response = await fetch(`/api/search?q=${searchTerm}`);
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
        var resultsArray = Object.values(results);
        searchResultsSection.innerHTML = '';
        if (resultsArray.length > 0) {
            resultsArray.forEach(result => {
                const gameElement = document.createElement('div');
                gameElement.classList.add('search-result');
                if (result.getInfo != null) {
                    gameElement.innerHTML = `
                        <h3>${result.title}</h3>
                        <p>Provider: Flashpoint</p>
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
                } else if (result.provider === "armorGames") {
                    gameElement.innerHTML = `
                    <h3>${result.title}</h3>
                    <p>Provider: Armor Games</p>
                    <a onclick="playArmor('${result.id}')" target="_blank">Play Game</a>
                    <img loading="lazy" src="${result.cover}" alt="${result.title} Cover">
                `;
                } else if (result.provider === "crazyGames") {
                    gameElement.innerHTML = `
                    <h3>${result.title}</h3>
                    <p>Provider: Crazy Games</p>
                    <a onclick="playCrazygames('${result.directLink}', '${result.title}')" target="_blank">Play Game</a>
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
function playCrazygames(url, gameName) {
    //if (localStorage.getItem('userId') != null) {
    //    fetch(`play?userId=${localStorage.getItem('userId')}&gameName=${gameName}`);
    //};
    localStorage.setItem('provider', 'crazygames');
    localStorage.setItem('URL', url);
    window.location.href = 'go.html';
}
async function playFlashpoint(id, gameName) {
    //if (localStorage.getItem('userId') != null) {
    //    fetch(`play?userId=${localStorage.getItem('userId')}&gameName=${gameName}`);
    //};
    const get = `flash?id=${id}`;
    f = fetch(get)
        .then(async response => {
            if (response.status == 404) {
                alert('Game not found. Please report this to the developer.');
            } else {
                response = await response.json();
                localStorage.setItem('provider', 'flashpoint');
                localStorage.setItem('gamePath', response.gamePath);
                localStorage.setItem('zipPath', response.zipPath)
                window.location.href = 'flash.html';
            }
        });
};
async function playArmor(id) {
    //if (localStorage.getItem('userId') != null) {
    //    fetch(`play?userId=${localStorage.getItem('userId')}&gameName=${gameName}`);
    //};
    const get = `armorgames?game_id=${id}`;
    f = await fetch(get)
        .then(async response => {
            if (response.status === 404) {
                alert('Game not found. Please report this to the developer.');
            } else if (response.status === 200) {
                response = await response.json();
                localStorage.setItem('provider', 'armorgames');
                if (response.gameType === "Flash") {
                    localStorage.setItem('gamePath', response.directLink);
                    window.location.href = 'flash.html';
                } else if (response.gameType === "HTML") {
                    localStorage.setItem('URL', response.directLink);
                    window.location.href = 'go.html';
                }
            }
        });

}
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
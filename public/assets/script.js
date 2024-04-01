document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('view') === 'list') {
        searchResultsSection.style.display = 'block';
    } else if (localStorage.getItem('view') === 'card') {
        searchResultsSection.style.display = 'flex';
    }
    //localStorage.removeItem('gamePath');
    //localStorage.removeItem('zipPath');
    //localStorage.removeItem('URL');
    //localStorage.removeItem('provider')
});
async function searchGames(event) {
    event.preventDefault();
    const searchTerm = document.querySelector('.search-bar input').value;
    if (searchTerm.trim() === '') {
        return;
    };
    try {
        const response = await fetch(`/api/search?q=${searchTerm}`);
        const searchResults = await response.json();
        console.log(searchResults);
        displaySearchResults(searchResults);
    } catch (error) {
        console.error('Error fetching search results:', error);
    };
};
const displaySearchResults = (results) => {
    const searchResultsSection = document.getElementById('search-results');
    var resultsArray = Object.values(results);
    searchResultsSection.innerHTML = '';
    let starred = localStorage.getItem('starred');
    if (starred === null) {
        starred = [];
    } else {
        starred = JSON.parse(starred);
    }
    if (resultsArray.length > 0) {
        resultsArray.forEach(result => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('search-result');
            const isStarred = starred.find(game => game.id === result.id);
            const starredIconSrc = isStarred ? 'assets/images/starred.svg' : 'assets/images/unstarred.svg';
            if (result.provider === "flashpoint") {
                gameElement.innerHTML = `
                    <h3>${result.title} <img style="max-width: 20px; max-height: 20px;" src="${starredIconSrc}" onclick="starGame('${result.id}', '${result.title}', '${result.cover}', '${result.provider}')" alt="star"></h3>
                    <p>Provider: Flashpoint</p>
                    <img loading="lazy" src="${result.cover}" alt="${result.title} Cover"><br>
                    <a onclick="playFlashpoint('${result.id}', '${result.title}')" target="_blank">Play Game</a>
                `;
                searchResultsSection.appendChild(gameElement);
                return;                
            } else if (result.provider === "armorgames") {
                gameElement.innerHTML = `
                    <h3>${result.title} <img style="max-width: 20px; max-height: 20px;" src="${starredIconSrc}" onclick="starGame('${result.id}', '${result.title}', '${result.cover}', '${result.provider}')" alt="star"></h3>
                    <p>Provider: Armor Games</p>
                    <img loading="lazy" src="${result.cover}" alt="${result.title} Cover"><br>
                    <a onclick="playArmor('${result.id}')" target="_blank">Play Game</a>
                `;
            } else if (result.provider === "crazygames") {
                gameElement.innerHTML = `
                    <h3>${result.title} <img style="max-width: 20px; max-height: 20px;" src="${starredIconSrc}" onclick="starGame('${result.id}', '${result.title}', '${result.cover}', '${result.provider}')" alt="star"></h3>
                    <p>Provider: Crazy Games</p>
                    <img loading="lazy" src="${result.cover}" alt="${result.title} Cover"><br>
                    <a onclick="playCrazygames('${result.directLink}', '${result.title}')" target="_blank">Play Game</a>
                `;
            //} else if (result.apeRating != null) {
            //    gameElement.innerHTML = `
            //    <h3>${result.title}</h3>
            //    <!--<p>Mobile Friendly: ${result.mobileFriendly}</p>-->
            //    <!--<p>Age Rating: ${result.ageRating}</p>-->
            //    <a onclick="playYandex('${result.id}')" target="_blank">Play Game</a>
            //    <img loading="lazy" src="${result.cover}" alt="${result.title} Cover">
            //`;
            }
            searchResultsSection.appendChild(gameElement);
        });
    } else {
        searchResultsSection.innerHTML = '<p>No results found.</p>';
    }
};
function playCrazygames(url) {
    //if (localStorage.getItem('userId') != null) {
    //    fetch(`play?userId=${localStorage.getItem('userId')}&gameName=${gameName}`);
    //};
    localStorage.setItem('provider', 'crazygames');
    localStorage.setItem('URL', url);
    window.location.href = 'go.html';
}
async function playFlashpoint(id) {
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
                };
            };
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
function starGame(id, title, image, provider) {
    let starred = localStorage.getItem('starred');
    if (starred === null) {
        starred = [];
    } else {
        starred = JSON.parse(starred);
    }
    const existingGameIndex = starred.findIndex(game => game.id === id);

    if (existingGameIndex !== -1) {
        starred.splice(existingGameIndex, 1);
    } else {
        starred.push({ id, title, image, provider });
    }

    // Update the localStorage
    localStorage.setItem('starred', JSON.stringify(starred));

    // Find the h3 element containing the title
    const h3Elements = document.querySelectorAll('.search-result h3');
    const targetH3 = Array.from(h3Elements).find(h3 => h3.textContent.trim() === title);

    if (targetH3) {
        // Ensure we're selecting the correct img element within the targeted h3
        const imgElement = targetH3.querySelector('img');
        if (imgElement) {
            // Update the image source based on whether the game is starred or not
            imgElement.src = existingGameIndex !== -1 ? 'assets/images/unstarred.svg' : 'assets/images/starred.svg';
        } else {
            console.log("No img element found within the targeted h3.");
        }
    } else {
        console.log("No h3 element found containing the specified title.");
    }
}
document.addEventListener('DOMContentLoaded', () => {
    let starred = localStorage.getItem('starred');
    if (starred !== null && starred.length !== 0) {
        starred = JSON.parse(starred);
        const starredSection = document.getElementById('search-results');
        starredSection.style.display = 'block';
        starred.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('search-result');
            gameElement.innerHTML = `
                <h3>${game.title} <img style="max-width: 20px; max-height: 20px;" src="assets/images/starred.svg" onclick="starGame('${game.id}', '${game.title}', '${game.image}', '${game.provider}')" alt="star"></h3>
                <!--<p>Provider: ${game.provider}</p>-->
                <img loading="lazy" src="${game.image}" alt="${game.title} Cover"><br>
                <a onclick="playFlashpoint('${game.id}', '${game.title}')" target="_blank">Play Game</a>
            `;
            starredSection.appendChild(gameElement);
        });
    };
});
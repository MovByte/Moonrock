const fs = require('fs').promises;
async function searchArmorGames(searchTerm) {
    const json = JSON.parse(await fs.readFile('cache/armorgames.json'));
    const results = armorGamesResponseJson.filter(game => game.label && game.label.toLowerCase().includes(searchTerm.toLowerCase()));
    return results;
}
searchArmorGames('arcade').then(console.log);
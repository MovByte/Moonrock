const fs = require('fs-extra');
async function updateCache() {
    console.log('Fetching...')
    fetch('https://armorgames.com/service/game-search', {
      "credentials": "omit",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en,en-US;q=0.5",
        "Content-Type": "application/json;charset=utf-8",
        "Origin": "https://armorgames.com",
        "Connection": "keep-alive",
        "Referer": "https://armorgames.com/"
      },
      "referrer": "https://armorgames.com/",
      "method": "GET",
      "mode": "cors"
    }).then(response => response.json()).then(async json => {
      await fs.ensureDir('cache').then(async () => {
        await fs.writeFile('cache/armorgames.json', JSON.stringify(json)).then(() => {
          console.log('Written successfully to cache/armorgames.json');
        });
      });
    });
  };
updateCache();
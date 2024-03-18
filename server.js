const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs-extra')
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy; 
require('dotenv').config();
const axios = require('axios');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cheerio = require('cheerio');
const db = new sqlite3.Database('./data.db');

var scopes = ['identify'];

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.SECURE, // Set to true if using HTTPS
    maxAge:  24 * 60 * 60 * 7 * 1000 // Cookie expires after a week
  }
}));

async function fetchGame(url, provider, id) {
  if (provider === "Armor Games") {
    if (fs.existsSync(`debug/armorgames-${id}.html`)) {
      console.log(`Reading from debug/armorgames-${id}.html`);
      return await fs.readFile(`debug/armorgames-${id}.html`, 'utf8');
    } else {
      const response = await fetch(url)
      const text = await response.text();
      await fs.writeFile(`debug/armorgames-${id}.html`, text);
      console.log(`Saved ${id} to debug/armorgames-${id}.html`);
      return await text;
      //return await fs.readFile(`debug/armorgames-${id}.html`, 'utf8');
    }
  };
  //if (name === "Crazy Games") {
  //  fetch(url).then(response => response.text()).then(text => {
  //    fs.writeFile(`debug/crazygames-${id}.html`, text);
  //    console.log(`Saved ${id} to debug/crazygames-${id}.html`);
  //  });
  //};
  //if (name === "Yandex Games") {
  //  fetch(url).then(response => response.text()).then(text => {
  //    fs.writeFile(`debug/yandexgames-${id}.html`, text);
  //    console.log(`Saved ${id} to debug/yandexgames-${id}.html`);
  //  });
  //};
};
app.use(cookieParser())

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: scopes
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ discordId: profile.id }, function(err, user) {
      console.log(profile);
      console.log(`Access token: ${accessToken}`);
      console.log(`Refresh token: ${refreshToken}`)
      return cb(err, user);
  });
}));
app.use(passport.initialize());
app.use(passport.session());
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, name TEXT UNIQUE, userId INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS game_activity (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, gameName TEXT, playTime DATETIME DEFAULT CURRENT_TIMESTAMP)');
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  const params = new URLSearchParams();
  params.append('client_id', process.env.DISCORD_CLIENT_ID);
  params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.DISCORD_CALLBACK_URL);

  try {
      const response = await axios.post('https://discord.com/api/oauth2/token', params);
      const { access_token, token_type } = response.data;
      console.log(response.data);
      // Store the user ID, username, and global_name to database
      const userDataResponse = await axios.get('https://discord.com/api/users/@me', {
          headers: {
              authorization: `${token_type} ${access_token}`
          }
      });
      const user = userDataResponse.data;
      console.log(user);
      return res.send(`
          <div style="margin: 300px auto; max-width: 400px; display: flex; flex-direction: column; align-items: center; font-family: sans-serif;">
              <h3>Welcome, ${user.global_name}</h3>
              <script>
                localStorage.setItem('userId', '${user.id}');
                window.location.replace('/');
              </script>
          </div>
      `);
  } catch (error) {
      console.log('Error', error);
      return res.send('An error occurred while processing your request.');
}
});

async function updateCache() {
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

// TODO: Add rate limiting and prevent unauthorized access
app.use('/play', async (req, res) => {
  const gameName = req.query.gameName
  const userId = req.query.userId
  console.log(`User ${userId} is playing ${gameName}`)
  db.run('INSERT INTO game_activity (userId, gameName) VALUES (?, ?)', [userId, gameName], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log(`A row has been inserted to game_activity with rowId ${this.lastID}`);
  });
});

app.use('/flash', async (req, res) => {
  const id = req.query.id;
  const get = `https://ooooooooo.ooo/get?id=${id}`;
  const response = await fetch(get);
  console.log(`Retrieved ${id} with response ${response.status}`);
  if (response.status == 500) {
    res.status(404).json({ error: 'UUID is invalid' });
  } else {
    const json = await response.json();
    res.json({
      uuid: json.uuid,
      title: json.title,
      utcMilli: json.utcMilli,
      extreme: json.extreme,
      gamePath: json.launchCommand,
      zipPath: `https://download.unstable.life/gib-roms/Games/${json.uuid}-${json.utcMilli}.zip`,
      gameLocationOnZip: decodeURIComponent('content/' + new URL(json.launchCommand).hostname + new URL(json.launchCommand).pathname),
    });
  }
});

//app.use('/yandex', async (req, res) => {
//  const id = req.query.appID;
//  const get = `https://yandex.com/games/app/${id}`;
//  const response = await fetch(get, {
//    "credentials": "include",
//    "headers": {
//      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
//      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
//      "Accept-Language": "en,en-US;q=0.5",
//      "Prefer": "safe",
//      "Upgrade-Insecure-Requests": "1",
//      "Sec-Fetch-Dest": "document",
//      "Sec-Fetch-Mode": "navigate",
//      "Sec-Fetch-Site": "none",
//      "Sec-Fetch-User": "?1"
//    },
//    "method": "GET",
//    "mode": "cors"
//  });
//  console.log(`Retrieved ${id} with response ${response.status}`);
//  if (response.status == 404) {
//    res.status(404).json({ error: 'Game not found' });
//  } else {
//    const html = await response.text();
//    // https://app-193229.games.s3.yandex.net/193229/xl4j3o6bypgxe6bekum7rl198bopqwhj/index.html
//    await fs.ensureDir('debug');
//    fs.writeFile(`debug/yandex-${id}.html`, html);
//    res.send(html);
//  }
//});

app.use('/armorgames', async (req, res) => {
  var id = null;
  var name = null;
  var gameType = null;
  var game = null;
  var html = null;
  var cover = null;
  var searchResults = null;
  var url = null;
  console.log(req.query)
  if (req.query.game_id === null) {
    res.status(400);
    res.json({ error: 'Game ID required' });
    console.log("No game_id detected on Armor Games function")
  } else if (req.query.game_id !== null) {
    fs.readFile('cache/armorgames.json', 'utf8', async (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        var game = null;
        const json = JSON.parse(data);
        var gameResult = json.filter(game => Number(game.game_id) === Number(req.query.game_id));
        console.log(gameResult);
        if (gameResult.length === 0) {
          res.status(404).json({ error: 'Game not found' });
        } else if (gameResult.length > 1) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          gameResult = gameResult[0];
          url = gameResult.url;
          cover = gameResult.thumbnail;
          if (gameResult.url.split('/')[1] === 'play') {
            console.log("Flash game on Armor Games detected");
            id = gameResult.game_id;
            name = gameResult.url.split('/')[2];
            gameType = 'Flash';
            console.log(`Retrieving with id ${id} and name ${name} from Armor Games and detected game type Flash`);
            html = await fetchGame(`https://armorgames.com${gameResult.url}`, 'Armor Games', id);
            game = cheerio.load(html)('param[name="movie"]').attr('value');
          } else {
            console.log("HTML game on Armor Games detected");
            id = gameResult.game_id;
            name = gameResult.url.split('/')[1];
            gameType = 'HTML';
            console.log(`Retrieving with id ${id} and name ${name} from Armor Games and detected game type HTML`);
            html = await fetchGame(`https://armorgames.com${gameResult.url}`, 'Armor Games', id);
            game = cheerio.load(html)('#html-game-frame').attr('src');
          };
          searchResults = {
            id: id,
            title: gameResult.label,
            cover: cover, // TODO: Get better image https://gamemedia.armorgames.com/16083/icn_feat.png https://gamemedia.armorgames.com/16083/icn_thmb.png
            gameUrl: `https://armorgames.com${url}`,
            gameType: gameType,
            directLink: game
          };
          res.json(searchResults);
        }
      }
    });
  };
});

app.use('/crazygames', async (req, res) => {
  const id = req.query.slug;
  const get = `https://games.crazygames.com/en-US/${id}/index.html`;
  const response = await fetch(get, {
    "credentials": "include",
    "headers": {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en,en-US;q=0.5",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1"
    },
    "method": "GET",
    "mode": "cors"
  });
  console.log(`Retrieved ${id} with response ${response.status}`);
  if (response.status == 404) {
    res.status(404).json({ error: 'Game not found' });
  } else {
    const html = await response.text();
    await fs.ensureDir('debug');
    fs.writeFile(`debug/crazygames-${id}.html`, html);
    res.send(html);
  };
});

app.use(express.static(path.join(__dirname, 'public_html')));

app.use('/api/search', async (req, res) => {
  console.log('Query:', req.query)
  if (req.query.q) {
    try {
      const searchTerm = req.query.q;
      const limit = req.query.limit || process.env.QUERY_LIMIT || null;
      var crazyGamesApiUrl = `https://api.crazygames.com/v3/en_US/search?q=${searchTerm}&limit=${limit}&includeTopGames=true`;
      var yandexGamesApiUrl = `https://yandex.com/games/api/catalogue/v3/search/?query=${searchTerm}&games_count=${limit}`;
      //var gameFlareApiUrl = `https://www.gameflare.com/search/ajax/`;
      //const armorGamesApiUrl = `https://armorgames.com/service/game-search`;
      if (limit === null) {
        console.log('No limit specified')
        yandexGamesApiUrl = `https://yandex.com/games/api/catalogue/v3/search/?query=${searchTerm}`;
        crazyGamesApiUrl = `https://api.crazygames.com/v3/en_US/search?q=${searchTerm}&includeTopGames=true`;
      };
//      const gameFlareApiResponse = await fetch(gameFlareApiUrl, {
//        "credentials": "include",
//        "headers": {
//            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
//            "Accept": "*/*",
//            "Accept-Language": "en,en-US;q=0.5",
//            "Prefer": "safe",
//            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//            "X-CSRF-TOKEN": "0WguwWGV0sGyspgl8CpmR9s3AaPsLtrCf23B4Udr",
//            "X-Requested-With": "XMLHttpRequest",
//            "Sec-GPC": "1",
//            "Sec-Fetch-Dest": "empty",
//            "Sec-Fetch-Mode": "cors",
//            "Sec-Fetch-Site": "same-origin"
//        },
//        "referrer": "https://www.gameflare.com/",
//        "body": `type=search-suggestions&term=${searchTerm.replace(' ', '+')}`,
//        "method": "POST",
//        "mode": "cors"
//      });
//      if (!gameFlareApiResponse.ok) {
//        throw new Error(`Failed to fetch data from GameFlare API (${gameFlareApiResponse.status} ${gameFlareApiResponse.statusText})`);
//      };
//      const gameFlareApiResponseJson = await gameFlareApiResponse.json();
//      if (!gameFlareApiResponseJson || !Array.isArray(gameFlareApiResponseJson)) {
//        throw new Error(`Unexpected response format from GameFlare API (${gameFlareApiResponse.status} ${gameFlareApiResponse.statusText})`);
//      };
//      const searchResultsGameFlare = gameFlareApiResponseJson.results.map(result => ({
//        title: result.alt,
//        gameUrl: result.src,
//        cover: result.src,
//        provider: 'gameFlare'
//       }));
//      const armorGamesApiResponse = await fetch(armorGamesApiUrl, {
//        "credentials": "omit",
//        "headers": {
//            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
//            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
//            "Accept-Language": "en,en-US;q=0.5",
//            "Prefer": "safe",
//            "Sec-GPC": "1",
//            "Alt-Used": "armorgames.com",
//            "Upgrade-Insecure-Requests": "1",
//            "Sec-Fetch-Dest": "document",
//            "Sec-Fetch-Mode": "navigate",
//            "Sec-Fetch-Site": "cross-site"
//        },
//        "method": "GET",
//        "mode": "cors"
//      });
//      if (!armorGamesApiResponse.ok) {
//        throw new Error(`Failed to fetch data from Armor Games API (${armorGamesApiResponse.status} ${armorGamesApiResponse.statusText})`);
//      };
//      if (armorGamesApiResponse.ok) {
//        const armorGamesApiResponseJson = await armorGamesApiResponse.json();
//        if (!armorGamesApiResponseJson || !Array.isArray(armorGamesApiResponseJson)) {
//          throw new Error(`Unexpected response format from Armor Games API ${armorGamesApiResponse.status} ${armorGamesApiResponse.statusText}`);
//        } else {
//          await fs.ensureDir('cache');
//          await fs.writeFile('cache/armorgames.json', JSON.stringify(armorGamesApiResponseJson));
//        };
//      };
      const armorGamesApiJson = require('./cache/armorgames.json');
      const armorGamesResults = armorGamesApiJson.filter(game => game.label && game.label.toLowerCase().includes(searchTerm.toLowerCase()));
      const searchResultsArmorGames = await armorGamesResults.map(game => ({
        id: game.game_id,
        title: game.label,
        cover: game.thumbnail,
        gameUrl: `https://armorgames.com${game.url}`,
        provider: 'armorGames'
//        directLink: `https://armorgames.com${game.url}`
      }));
//      const yandexGamesApiResponse = await fetch(yandexGamesApiUrl);
//      if (!yandexGamesApiResponse.ok) {
//        throw new Error(`Failed to fetch data from Yandex Games API (${yandexGamesApiResponse.status} ${yandexGamesApiResponse.statusText})`);
//      }
//      const yandexGamesResponseJson = await yandexGamesApiResponse.json();
//      if (!yandexGamesResponseJson || !yandexGamesResponseJson.feed || !Array.isArray(yandexGamesResponseJson.feed)) {
//        throw new Error('Unexpected response format from Yandex Games API');
//      }
//      const searchResultsYandexGames = await yandexGamesResponseJson.feed[0].items.map(item => ({
//          id: item.appID,
//          title: item.title,
//          directLink: `https://yandex.com/games/app/${item.appID}`,
//          cover: `${item.media.cover['prefix-url']}pjpg256x256`,
//          ageRating: item.features.age_rating,
//        }));      
      const crazyGamesApiResponse = await fetch(crazyGamesApiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        },
      });
      if (!crazyGamesApiResponse.ok) {
        throw new Error(`Failed to fetch data from CrazyGames API (${crazyGamesApiResponse.status} ${crazyGamesApiResponse.statusText})`);
      }
      const crazyGamesResponseJson = await crazyGamesApiResponse.json();
      if (!crazyGamesResponseJson || !crazyGamesResponseJson.result || !Array.isArray(crazyGamesResponseJson.result)) {
        throw new Error('Unexpected response format from CrazyGames API');
      }
      const searchResultsCrazyGames = crazyGamesResponseJson.result
        .filter(result => result.recordType !== 'tag')
        .map(result => ({
          title: result.name,
          directLink: `https://games.crazygames.com/en-US/${result.slug}/index.html`,
          cover: `https://images.crazygames.com/${result.cover}`,
          provider: 'crazyGames',
          mobileFriendly: result.mobileFriendly,
        }));
      const flashpointApiUrl = `https://db-api.unstable.life/search?smartSearch=${searchTerm}&filter=true&fields=id,title,developer,publisher,platform,tags,originalDescription`;
      const flashpointApiResponse = await fetch(flashpointApiUrl);
      if (!flashpointApiResponse.ok) {
        throw new Error(`Failed to fetch data from Flashpoint API (${flashpointApiResponse.status} ${flashpointApiResponse.statusText})`);
      }
      const flashpointResponseJson = await flashpointApiResponse.json();
      if (!flashpointResponseJson || !Array.isArray(flashpointResponseJson)) {
        throw new Error('Unexpected response format from Flashpoint API');
      }
      const searchResultsFlashpoint = flashpointResponseJson
        .filter(result => result.platform === 'Flash')
        .map(result => ({
          id: result.id,          
          title: result.title,
          developer: result.developer,
          publisher: result.publisher,
          description: result.originalDescription,
          cover: `https://infinity.unstable.life/images/Logos/${result.id.substring(0,2)}/${result.id.substring(2,4)}/${result.id}.png?type=jpg`,
          directLink: `https://ooooooooo.ooo/?${result.id}`,
          gameFile: `https://download.unstable.life/gib-roms/Games/${result.id}`,
          getInfo: `https://ooooooooo.ooo/get?id=${result.id}`,
        }));
      //const combinedResults = [...searchResultsArmorGames, ...searchResultsYandexGames, ...searchResultsCrazyGames, ...searchResultsFlashpoint];
      //const combinedResults = { armorGames: searchResultsArmorGames, yandexGames: searchResultsYandexGames, crazyGames: searchResultsCrazyGames, flashpoint: searchResultsFlashpoint };
      const combinedResults = { ...searchResultsArmorGames, ...searchResultsCrazyGames, ...searchResultsFlashpoint };
      res.json(combinedResults);
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.redirect('/');
  }
});

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (url === undefined) {
    return res.status(400).json({ error: "URL is required" });
  } else if (!url.startsWith("https://download.unstable.life/gib-roms/Games/")) {
    return res.status(400).json({ error: "URL isn't invalid" });
  } else if (!url.endsWith(".zip")) {
    return res.status(400).json({ error: "URL isn't invalid" });
  } else {
    try {
      console.log(`Fetching file from ${url}`)
      response = await fetch(url);
      if (response.ok) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Disposition", `attachment; filename=${url.split("/").pop()}`);
        res.send(Buffer.from(await response.arrayBuffer()));
      } else {
        res.status(500).json({ error: "Failed to fetch file" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
      console.error(error);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
  if (!fs.existsSync('cache/armorgames.json')) {
    console.log('Cache not found, updating cache');
    updateCache();
  }
});
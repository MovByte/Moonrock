const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs-extra')
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy; 
require('dotenv').config();
const session = require('express-session');
const db = new sqlite3.Database('./data.db');

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if you're using HTTPS
    maxAge:  24 *  60 *  60 *  1000 // Cookie expires after  24 hours
  }
}));

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL, // /auth/discord/callback
  scope: ['identify', 'email']
},
function(accessToken, refreshToken, profile, done) {
  // Here you would find or create a user in your database
  // Then call done with the user object
  done(null, profile);
}
));
app.use(passport.initialize());
app.use(passport.session());
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS game_activity (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, gameSlug TEXT, playTime DATETIME DEFAULT CURRENT_TIMESTAMP)');
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, get the user's Discord ID
    const discordId = req.user.id;

    // Check if the user exists in your database by Discord ID
    db.get('SELECT * FROM users WHERE discord_id = ?', [discordId], (err, row) => {
      if (err) {
        return console.error(err.message);
      }

      if (!row) {
        // If the user does not exist, insert them into the database
        db.run('INSERT INTO users (discord_id, username) VALUES (?, ?)', [discordId, req.user.username], function(err) {
          if (err) {
            return console.error(err.message);
          }
          console.log(`User ${req.user.username} added to the database.`);
        });
      } else {
        // If the user exists, update their last login timestamp or other relevant fields
        db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE discord_id = ?', [discordId]);
      }
    });

    // Redirect the user to the home page or wherever you want them to land
    res.redirect('/');
  });

app.use(express.static(path.join(__dirname, 'public_html')));

app.use('/flash', async (req, res) => {
  const id = req.query.id;
  const get = `https://ooooooooo.ooo/get?id=${id}`;
  const response = await fetch(get);
  console.log(`Retrieved ${id} with response ${response.status}`);
  if (response.status == 500) {
    res.status(404).json({ error: 'UUID is invalid' });
  } else {
    const json = await response.json();
    //Log to database the json.title and the time
    
    res.json(json.launchCommand);
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

app.use('/search', async (req, res) => {
  console.log('Query:', req.query)
  if (req.query.q) {
    try {
      const searchTerm = req.query.q;
      const limit = req.query.limit || process.env.QUERY_LIMIT || 10;
      const yandexGamesApiUrl = `https://yandex.com/games/api/catalogue/v3/search/?query=${searchTerm}&games_count=${limit}`;
      const yandexGamesApiResponse = await fetch(yandexGamesApiUrl);
      if (!yandexGamesApiResponse.ok) {
        throw new Error(`Failed to fetch data from Yandex Games API (${yandexGamesApiResponse.status} ${yandexGamesApiResponse.statusText})`);
      }
      const yandexGamesResponseJson = await yandexGamesApiResponse.json();
      if (!yandexGamesResponseJson || !yandexGamesResponseJson.feed || !Array.isArray(yandexGamesResponseJson.feed)) {
        throw new Error('Unexpected response format from Yandex Games API');
      }
      const searchResultsYandexGames = await yandexGamesResponseJson.feed[0].items.map(item => ({
          id: item.appID,
          title: item.title,
          directLink: `https://yandex.com/games/app/${item.appID}`,
          cover: `${item.media.cover['prefix-url']}pjpg256x256`,
          ageRating: item.features.age_rating,
        }));
      const crazyGamesApiUrl = `https://api.crazygames.com/v3/en_US/search?q=${searchTerm}&limit=${limit}&includeTopGames=true`;
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
      //const combinedResults = [...searchResultsYandexGames, ...searchResultsCrazyGames, ...searchResultsFlashpoint];
      //const combinedResults = { yandexGames: searchResultsYandexGames, crazyGames: searchResultsCrazyGames, flashpoint: searchResultsFlashpoint };
      const combinedResults = {...searchResultsCrazyGames, ...searchResultsFlashpoint };
      res.json(combinedResults);
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.redirect('/');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
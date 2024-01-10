const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public_html')));

app.get('/search', async (req, res) => {
  if (req.query.q) {
    try {
      const searchTerm = req.query.q;
      const limit = req.query.limit || 10;
      const yandexGamesApiUrl = `https://yandex.com/games/api/catalogue/v3/search/?query=${searchTerm}&games_count=${limit}`;
      const yandexGamesApiResponse = await fetch(yandexGamesApiUrl);
      if (!yandexGamesApiResponse.ok) {
        throw new Error(`Failed to fetch data from Yandex Games API (${yandexGamesApiResponse.status} ${yandexGamesApiResponse.statusText})`);
      }
      const searchResultsYandexGames = yandexGamesApiResponse.json().then(response => {
        return response.feed[0].items.map(item => ({
          title: item.title,
          directGame: `https://yandex.com/games/app/${item.appID}`,
          cover: item.media.cover.prefix-url,
          rating: item.rating,
        }));
      });

      // CrazyGames API
      const crazyGamesApiUrl = `https://api.crazygames.com/v3/en_US/search?q=${searchTerm}&limit=${limit}&includeTopGames=true`;
      const crazyGamesApiResponse = await fetch(crazyGamesApiUrl);

      if (!crazyGamesApiResponse.ok) {
        throw new Error(`Failed to fetch data from CrazyGames API (${crazyGamesApiResponse.status} ${crazyGamesApiResponse.statusText})`);
      }

      const searchResultsCrazyGames = await crazyGamesApiResponse.json().result
        .filter(result => result.recordType !== 'tag')
        .map(result => ({
          title: result.name,
          directGame: `https://games.crazygames.com/en-US/${result.slug}/index.html`,
          cover: `https://images.crazygames.com/${result.cover}`,
          mobileFriendly: result.mobileFriendly,
          //androidFriendly: result.androidFriendly,
          //iosFriendly: result.iosFriendly,
        }));

      // Combine results and send response
      const combinedResults = [...searchResultsYandexGames, ...searchResultsCrazyGames];
      res.json(searchResultsCrazyGames);

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
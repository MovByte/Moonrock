const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public_html')));
app.get('/search', async (req, res) => {
 if (req.query.q) {
  try {
    const searchTerm = req.query.q;
    const limit = req.query.limit || 10;
    const apiUrl = `https://api.crazygames.com/v3/en_US/search?q=${searchTerm}&limit=${limit}&device=desktop&includeTopGames=true`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data from CrazyGames API (${response.status} ${response.statusText})`);
    }
    const data = await response.json();

    // Extract relevant data from the response
    const searchResults = data.result.map(result => ({
      title: result.name,
      slug: result.slug,
      cover: result.cover,
      videos: result.videos,
      https: result.https,
      mobileFriendly: result.mobileFriendly,
      androidFriendly: result.androidFriendly,
      iosFriendly: result.iosFriendly,
      recordType: result.recordType,
    }));
    res.json(searchResults);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 } else {
  res.redirect('/')
 }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server is running http://localhost:${PORT}`);
});
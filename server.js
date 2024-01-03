const express = require('express');
const app = express();
const path = require('path');

// Serve static files (your HTML, CSS, and images)
app.use(express.static(path.join(__dirname, 'public_html')));

// API endpoint to get search results from Crazy Games
app.get('/api/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const limit = req.query.limit || 10; // Set a default limit if not provided

    // Make a request to the Crazy Games API using fetch
    const apiUrl = `https://api.crazygames.com/v3/en_US/search?q=${searchTerm}&limit=${limit}&device=desktop&includeTopGames=true`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch data from CrazyGames API (${response.status} ${response.statusText})`);
    }

    // Parse JSON from the response
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
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});

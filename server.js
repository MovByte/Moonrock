const express = require('express');
const app = express();
const path = require('path');

// Serve static files (your HTML, CSS, and images)
app.use(express.static(path.join(__dirname, 'public_html')));

// Dummy search results
const dummySearchResults = [
  { title: 'Result 1', description: 'Description 1' },
  { title: 'Result 2', description: 'Description 2' },
  { title: 'Result 3', description: 'Description 3' },
  // Add more dummy results as needed
];

// API endpoint to get search results
app.get('/api/search', (req, res) => {
  // You can add actual search logic here in the future
  // For now, just send dummy results
  res.json(dummySearchResults);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

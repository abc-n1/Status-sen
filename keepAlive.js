const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Bot is online!');
});

// Start server
app.listen(port, () => {
  console.log(`Keep-alive server running on port ${port}`);
});

// Periodically ping the server to keep it alive
const keepAlive = () => {
  setInterval(() => {
    console.log('Pinging server to keep it alive...');
    // Add any additional checks if needed
  }, 5 * 60 * 1000); // Ping every 5 minutes
};

module.exports = { keepAlive };

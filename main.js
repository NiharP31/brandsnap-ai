const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Serve static files
app.use(express.static(__dirname));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'BrandSnap.ai is running' });
});

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

console.log(`🚀 BrandSnap.ai server starting on port ${port}`);
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
}); 
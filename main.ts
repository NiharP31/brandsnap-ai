const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Serve static files (HTML, CSS, JS, images)
app.use(express.static('.'));

// Fallback to index.html for any route (SPA behavior)
app.get('*', (req: any, res: any) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

console.log(`🚀 BrandSnap.ai server running on port ${port}`);
app.listen(port); 
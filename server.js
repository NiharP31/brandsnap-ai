const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

// MIME types for different file extensions with proper charset
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8', 
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Set security and caching headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Handle health check
  if (req.url === '/health') {
    res.writeHead(200, { 
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify({ status: 'OK', message: 'BrandSnap.ai is running' }));
    return;
  }
  
  // Determine file path
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // Remove query parameters
  if (filePath.includes('?')) {
    filePath = filePath.split('?')[0];
  }
  
  filePath = path.join(__dirname, filePath);
  
  // Get file extension
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'text/plain; charset=utf-8';
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found, serve index.html for SPA routing
      const indexPath = path.join(__dirname, 'index.html');
      fs.readFile(indexPath, 'utf8', (err, content) => {
        if (err) {
          res.writeHead(500, { 
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache'
          });
          res.end('Server Error');
          return;
        }
        res.writeHead(200, { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.end(content);
      });
      return;
    }
    
    // Serve the file with proper encoding
    if (['.html', '.css', '.js', '.json'].includes(ext)) {
      // Text files - read with UTF-8 encoding
      fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
          res.writeHead(500, { 
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache'
          });
          res.end('Server Error');
          return;
        }
        
        // Special headers for HTML files to prevent caching issues
        const headers = { 'Content-Type': contentType };
        if (ext === '.html') {
          headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
          headers['Pragma'] = 'no-cache';
          headers['Expires'] = '0';
        } else {
          headers['Cache-Control'] = 'public, max-age=3600';
        }
        
        res.writeHead(200, headers);
        res.end(content);
      });
    } else {
      // Binary files
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500, { 
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache'
          });
          res.end('Server Error');
          return;
        }
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600'
        });
        res.end(content);
      });
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 BrandSnap.ai server running on port ${port}`);
  console.log(`✅ Server started successfully`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
}); 
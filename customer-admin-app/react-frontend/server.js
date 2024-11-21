const express = require('express');
const path = require('path');
const app = express();

// Middleware for logging requests (useful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from the React build directory
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// Example API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Catch-all route for React (SPA fallback)
app.get('*', (req, res) => {
  const indexHtml = path.join(buildPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('An error occurred');
    }
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

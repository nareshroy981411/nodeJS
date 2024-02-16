// app.js
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
const routes = require('./routes/index');
app.use('/', routes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

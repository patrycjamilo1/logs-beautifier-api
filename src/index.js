const express = require('express');
const mongoose = require('mongoose');
const { port, dbURI } = require('./config/config');
const logsModel = require('./db/models/logs.model');

const app = express();

// Database connection
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => console.error('Database connection error:', err));

// Endpoint GET /logs
app.get('/logs', async (req, res) => {
  try {
    const logs = await logsModel.find({ "level": "info" });
    res.json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start HTTP server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

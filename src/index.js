const express = require('express');
const mongoose = require('mongoose');
const { port, dbURI } = require('./config/config');
const logsModel = require('./db/models/logs.model');
var cors = require('cors')

const app = express();
app.use(cors())
// Database connection
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => console.error('Database connection error:', err));

// Endpoint GET /logs
app.get('/logs', async (req, res) => {
  try {
    let filter = {};

    // Filtering parameters
    if (req.query.level) {
      filter.level = req.query.level.toLowerCase();
    }
    if (req.query.type) {
      filter.type = req.query.type.toLowerCase();
    }
    if (req.query.message) {
      filter.message = { $regex: new RegExp(req.query.message, 'i') };
    }
    if (req.query.startDate) {
      const startDate = new Date(req.query.startDate + 'T00:00:00.000Z');
      filter.createdAt = { $gte: startDate };
    }
    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate + 'T23:59:59.999Z');
      filter.createdAt = { ...filter.createdAt, $lte: endDate };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const totalRows = await logsModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const logs = await logsModel.find(filter)
      .skip(skip)
      .limit(limit);

    res.json({ data: { logs }, page, skip, limit, total: totalRows, totalPages });
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start HTTP server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const router = express.Router();
const LogsService = require('../services/logs.service');

router.get('/', async (req, res) => {
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
    
       const { logs, totalPages, totalRows } = await LogsService.getLogs(limit, skip, filter);
    
        res.json({ data: { logs }, page, limit, totalRows, totalPages });
      } catch (err) {
        console.error('Error fetching logs:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
const express = require('express');
const router = express.Router();
const LogsService = require('../services/logs.service');


/**
 * @swagger
 * components:
 *   schemas:
 *     Logs:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the log
 *         type:
 *           type: string
 *           description: The type of the log
 *         level:
 *           type: string
 *           description: The level of the log
 *         message:
 *           type: string
 *           description: The message of the log
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the log was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the log was updated
 *       example:
 *         _id: abc123
 *         type: system
 *         level: info
 *         message: System rebooted successfully
 *         createdAt: 2024-04-29T12:00:00.000Z
 *         updatedAT: 2024-04-29T12:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: The logs managing API
 * /logs:
 *   get:
 *     summary: Get logs
 *     description: Retrieve logs with optional filters and pagination
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter logs by type
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Filter logs by level
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs created after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs created before this date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of logs per page
 *         type: integer
 *     responses:
 *       200:
 *         description: A list of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Logs'
 */

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
        const limit = parseInt(req.query.limit, 10) || 15;
        const skip = (page - 1) * limit;
    
       const { logs, totalPages, totalRows } = await LogsService.getLogs(limit, skip, filter);
    
        res.json({ data: { logs }, page, limit, totalRows, totalPages });
      } catch (err) {
        console.error('Error fetching logs:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
const logsModel = require('../db/models/logs.model');


class LogsService {
    static async getLogs(limit, skip, filters) {
        const totalRows = await logsModel.countDocuments(filters);
        const totalPages = Math.ceil(totalRows / limit);
        const logs = await logsModel.find(filters)
          .skip(skip)
          .limit(limit);
        return { logs, totalPages, totalRows }
    }
}

module.exports = LogsService;
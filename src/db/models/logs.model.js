const mongoose = require('mongoose');
const logSchema = require('../schema/logs.schema');

const logsModel = mongoose.model('logs', logSchema);

module.exports = logsModel;

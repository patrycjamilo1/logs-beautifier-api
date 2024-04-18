const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    level: String,
    type: String,
    message: String,
})

logSchema.set('timestamps', true);

module.exports = logSchema;
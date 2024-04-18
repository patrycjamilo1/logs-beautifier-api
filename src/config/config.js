require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    dbURI: process.env.DB_URI
};
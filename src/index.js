const express = require('express');
const mongoose = require('mongoose');
const { port, dbURI } = require('./config/config');
const cors = require('cors');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const logsRoutes = require('./routes/logs.routes');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require("express-rate-limit");


const app = express();
app.use(cors());
app.use(helmet());

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

app.use(limiter);
// Swagger config
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Logs Beautifier API",
      version: "1.0.0",
      description:
        "This is a Logs Viewing application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: [`${__dirname}/routes/*.js`],
};

const specs = swaggerJsdoc(options);

app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
// Database connection
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => console.error('Database connection error:', err));

  app.use(compression())
// Register routes
app.use('/logs', logsRoutes);


// Start HTTP server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

// Routes

// Error handler
app.use(errorHandler);

module.exports = app;

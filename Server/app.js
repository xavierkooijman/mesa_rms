const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/restaurants", require("./routes/restaurant.routes"));
app.use("/menu-items", require("./routes/menuItem.routes"));
app.use("/menu-categories", require("./routes/menuCategories.routes"));
app.use("/tables", require("./routes/table.routes"));

// Error handler
app.use(errorHandler);

module.exports = app;

const { Pool } = require("pg");
require("dotenv").config();

const writePool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.WRITE_USER_NAME,
  password: process.env.WRITE_PASSWORD,
  database: process.env.DB_NAME,
});

const readPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.READ_USER_NAME,
  password: process.env.READ_PASSWORD,
  database: process.env.DB_NAME,
});

writePool.on("connect", () => {
  console.log("Connected to Postgres on writePool");
});

readPool.on("connect", () => {
  console.log("Connected to Postgres on readPool");
});

module.exports = { writePool, readPool };

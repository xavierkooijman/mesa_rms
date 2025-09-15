const { Pool } = require("pg");
require("dotenv").config();

const writePool = new Pool({
  connectionString: process.env.WRITE_DATABASE_URL,
});

const readPool = new Pool({
  connectionString: process.env.READ_DATABASE_URL,
});

writePool.on("connect", () => {
  console.log("Connected to Postgres on writePool");
});

readPool.on("connect", () => {
  console.log("Connected to Postgres on readPool");
});

module.exports = { writePool, readPool };
const { Sequelize } = require("sequelize");

require("dotenv").config({ path: "../.env" });

const USER = process.env.DB_USER;
const PORT = process.env.DB_PORT;
const HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize(
  `postgres://${USER}:${PASSWORD}@${HOST}:${PORT}/${DB_NAME}`
);

module.exports = sequelize;

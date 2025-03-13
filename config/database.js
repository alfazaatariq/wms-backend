const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("./config");

const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  {
    host: config[env].host,
    dialect: "postgres", // Replace with the appropriate dialect like "postgres", "sqlite", etc.
  }
);

module.exports = sequelize;

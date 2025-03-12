"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = sequelize.define(
  "user",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "username can not be null",
        },
        notEmpty: {
          msg: "username can not be empty",
        },
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "password can not be null",
        },
        notEmpty: {
          msg: "password can not be empty",
        },
      },
    },
    role: {
      allowNull: false,
      type: DataTypes.ENUM("1", "2"),
      validate: {
        notNull: {
          msg: "role can not be null",
        },
        notEmpty: {
          msg: "role can not be empty",
        },
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "user",
  }
);

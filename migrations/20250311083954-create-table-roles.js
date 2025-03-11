"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "roles",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        role: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
      },
      {
        tableName: "Roles",
        timestamps: false, // Disables createdAt and updatedAt
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("roles");
  },
};

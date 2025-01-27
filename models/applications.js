const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Applications = sequelize.define("applications", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  jobTitle: Sequelize.STRING,
  company: Sequelize.STRING,
  dateApplied: Sequelize.STRING,
  status: Sequelize.STRING,
  notes: Sequelize.STRING,
});

module.exports = Applications;

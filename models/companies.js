const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Companies = sequelize.define("companies", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  location: Sequelize.STRING,
  address: Sequelize.STRING,
  email: Sequelize.STRING,
  contact: Sequelize.STRING,
  companySize: Sequelize.INTEGER,
  industry: Sequelize.STRING,
});

module.exports = Companies;

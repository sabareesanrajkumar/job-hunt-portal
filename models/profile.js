const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Profiles = sequelize.define("profiles", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fullName: Sequelize.STRING,
  college: Sequelize.STRING,
  degree: Sequelize.STRING,
  branch: Sequelize.STRING,
  graduation: Sequelize.INTEGER,
  score: Sequelize.FLOAT,
  goals: Sequelize.STRING,
});

module.exports = Profiles;

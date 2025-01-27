const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Reminders = sequelize.define("reminders", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  application: Sequelize.STRING,
  due: Sequelize.STRING,
  reminder: Sequelize.STRING,
});

module.exports = Reminders;

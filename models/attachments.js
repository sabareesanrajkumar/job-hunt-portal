const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Attachments = sequelize.define("Attachments", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fileUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fileName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fileKey: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  applicationId: {
    type: Sequelize.INTEGER,
    references: {
      model: "Applications",
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

module.exports = Attachments;

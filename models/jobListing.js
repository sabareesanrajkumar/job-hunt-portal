const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const JobListing = sequelize.define("joblisting", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  jobTitle: Sequelize.STRING,
  company: Sequelize.STRING,
  description: Sequelize.STRING,
  requiredSkills: Sequelize.STRING,
  jobType: Sequelize.STRING,
  salary: Sequelize.STRING,
  deadline: Sequelize.STRING,
});

module.exports = JobListing;

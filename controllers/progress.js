const Applications = require("../models/applications");
const Reminders = require("../models/reminders");
const Sequelize = require("sequelize");

exports.getDashboard = async (req, res, next) => {
  try {
    const totalApplications = await Applications.count();
    const inProgressApplications = await Applications.count({
      where: {
        status: { [Sequelize.Op.notIn]: ["Offer Received", "Rejected"] },
      },
    });
    const statusCounts = await Applications.findAll({
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("status")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    const statusData = {
      Applied: 0,
      "Interview Scheduled": 0,
      "Offer Received": 0,
      Rejected: 0,
    };

    statusCounts.forEach((item) => {
      if (statusData.hasOwnProperty(item.status)) {
        statusData[item.status] = item.count;
      }
    });
    return res
      .status(200)
      .json({ totalApplications, inProgressApplications, statusData });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

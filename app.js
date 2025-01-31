const express = require("express");
const cors = require("cors");
const sequelize = require("./util/database");
const cron = require("node-cron");
const { Op } = require("sequelize");

const app = express();

app.use(cors());
app.use(express.json());
app.options("*", cors());

const userRoutes = require("./routes/users");
const passwordRoutes = require("./routes/password");
const profileRoutes = require("./routes/profile");
const companyRoutes = require("./routes/companies");
const reminderRoutes = require("./routes/reminders");
const progressRoutes = require("./routes/progress");
const applicationRoutes = require("./routes/applications");
const jobListingRoutes = require("./routes/jobListing");

app.use("/user", userRoutes);
app.use("/password", passwordRoutes);
app.use("/profile", profileRoutes);
app.use("/company", companyRoutes);
app.use("/reminder", reminderRoutes);
app.use("/progress", progressRoutes);
app.use("/application", applicationRoutes);
app.use("/joblisting", jobListingRoutes);

const Users = require("./models/users");
const passwordRequests = require("./models/passwordRequests");
const Profiles = require("./models/profile");
const Companies = require("./models/companies");
const Reminders = require("./models/reminders");
const Applications = require("./models/applications");
const JobListing = require("./models/jobListing");

cron.schedule("*/60 * * * *", async () => {
  const now = new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" })
    .replace(" ", "T")
    .slice(0, 16);

  await Reminders.destroy({
    where: {
      reminder: { [Op.lt]: now },
    },
  });
});

Users.hasMany(passwordRequests, {
  foreignKey: "userId",
});
passwordRequests.belongsTo(Users, {
  foreignKey: "userId",
});

Users.hasOne(Profiles, { foreignKey: "userId" });
Profiles.belongsTo(Users, { foreignKey: "userId" });

Users.hasMany(Companies, {
  foreignKey: "userId",
});
Companies.belongsTo(Users, {
  foreignKey: "userId",
});

Users.hasMany(Reminders, {
  foreignKey: "userId",
});
Reminders.belongsTo(Users, {
  foreignKey: "userId",
});

Users.hasMany(Applications, {
  foreignKey: "userId",
});
Applications.belongsTo(Users, {
  foreignKey: "userId",
});

Users.hasMany(JobListing, {
  foreignKey: "userId",
});
JobListing.belongsTo(Users, {
  foreignKey: "userId",
});

sequelize
  .sync()
  .then(() => {
    console.log("DB sync done");
  })
  .catch((err) => console.log(err));

app.listen(3000);

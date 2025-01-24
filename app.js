const express = require("express");
const cors = require("cors");
const sequelize = require("./util/database");

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/users");
const passwordRoutes = require("./routes/password");
const profileRoutes = require("./routes/profile");

app.use("/user", userRoutes);
app.use("/password", passwordRoutes);
app.use("/profile", profileRoutes);

const Users = require("./models/users");
const passwordRequests = require("./models/passwordRequests");
const Profiles = require("./models/profile");

Users.hasMany(passwordRequests, {
  foreignKey: "userId",
});
passwordRequests.belongsTo(Users, {
  foreignKey: "userId",
});

Users.hasOne(Profiles, { foreignKey: "userId" });
Profiles.belongsTo(Users, { foreignKey: "userId" });

sequelize
  .sync()
  .then(() => {
    console.log("DB sync done");
  })
  .catch((err) => console.log(err));

app.listen(3000);

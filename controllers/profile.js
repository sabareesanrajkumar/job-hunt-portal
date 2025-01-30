const Users = require("../models/users");
const Profile = require("../models/profile");

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (profile) {
      return res.status(200).json(profile);
    } else {
      return res.status(201).json("update your profile");
    }
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

exports.editProfile = async (req, res, next) => {
  try {
    const existingProfile = await Profile.findOne({
      where: { userId: req.user.dataValues.id },
    });

    if (existingProfile) {
      const { fullName, college, degree, branch, graduation, goals, score } =
        req.body;
      const editedProfile = await existingProfile.update({
        fullName,
        college,
        degree,
        branch,
        graduation,
        goals,
        score,
      });
      if (editedProfile) {
        return res.status(200).json({ success: true });
      }
    } else {
      const { fullName, college, degree, branch, graduation, goals, score } =
        req.body;
      const newProfile = await Profile.create({
        fullName,
        college,
        degree,
        branch,
        graduation,
        goals,
        score,
        userId: req.user.id,
      });
      if (newProfile) {
        return res.status(200).json({ success: true });
      }
    }
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

exports.checkExistense = async (req, res, next) => {
  try {
    const userProfile = await Profile.findByPk(req.user.id);
    if (userProfile) {
      return res.status(200).json({ userProfile });
    } else {
      return res.status(201).json({ message: "create new profile" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

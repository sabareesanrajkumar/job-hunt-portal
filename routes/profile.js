const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profile");
const authenticationController = require("../middleware/auth");

router.get(
  "/getprofile",
  authenticationController.authenticate,
  profileController.getProfile
);

router.get(
  "/check",
  authenticationController.authenticate,
  profileController.checkExistense
);
router.post(
  "/editprofile",
  authenticationController.authenticate,
  profileController.editProfile
);

module.exports = router;

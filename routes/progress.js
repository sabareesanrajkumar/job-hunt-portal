const express = require("express");
const router = express.Router();

const progressController = require("../controllers/progress");
const authenticationController = require("../middleware/auth");

router.get(
  "/getdashboard",
  authenticationController.authenticate,
  progressController.getDashboard
);

module.exports = router;

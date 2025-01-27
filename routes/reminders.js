const express = require("express");
const router = express.Router();

const reminderController = require("../controllers/reminders");
const authenticationController = require("../middleware/auth");

router.post(
  "/addreminder",
  authenticationController.authenticate,
  reminderController.addReminder
);

module.exports = router;

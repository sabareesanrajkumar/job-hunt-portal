const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applications");
const authenticationController = require("../middleware/auth");

router.post(
  "/addapplication",
  authenticationController.authenticate,
  applicationController.addApplication
);

router.get(
  "/getapplication",
  authenticationController.authenticate,
  applicationController.getApplication
);

router.put(
  "/update/:id",
  authenticationController.authenticate,
  applicationController.updateApplication
);

module.exports = router;

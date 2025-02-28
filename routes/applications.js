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

router.post(
  "/search",
  authenticationController.authenticate,
  applicationController.searchApplication
);

router.put(
  "/update/:id",
  authenticationController.authenticate,
  applicationController.updateApplication
);

router.delete(
  "/delete/:id",
  authenticationController.authenticate,
  applicationController.deleteApplication
);

module.exports = router;

const express = require("express");
const router = express.Router();

const jobListingController = require("../controllers/jobListing");
const authenticationController = require("../middleware/auth");

router.get(
  "/getjoblisting",
  authenticationController.authenticate,
  jobListingController.getJobListings
);

router.post(
  "/addjob",
  authenticationController.authenticate,
  jobListingController.addJob
);

router.delete(
  "/delete/:id",
  authenticationController.authenticate,
  jobListingController.deleteJob
);

module.exports = router;

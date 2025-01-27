const express = require("express");
const router = express.Router();

const companiesController = require("../controllers/companies");
const authenticationController = require("../middleware/auth");

router.get(
  "/getcompanies",
  authenticationController.authenticate,
  companiesController.getCompanies
);

router.post(
  "/addcompany",
  authenticationController.authenticate,
  companiesController.addCompany
);

module.exports = router;

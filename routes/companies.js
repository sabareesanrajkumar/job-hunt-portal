const express = require("express");
const router = express.Router();

const companiesController = require("../controllers/companies");
const authenticationController = require("../middleware/auth");

router.post(
  "/addcompany",
  authenticationController.authenticate,
  companiesController.addCompany
);

module.exports = router;

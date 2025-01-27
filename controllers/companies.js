const Users = require("../models/users");
const companies = require("../models/companies");

exports.getCompanies = async (req, res, next) => {
  try {
    return res.status(201);
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

exports.addCompany = async (req, res, next) => {
  try {
    const { name, location, address, email, contact, companySize, industry } =
      req.body;
    const newCompany = await companies.create({
      name,
      location,
      address,
      email,
      contact,
      companySize,
      industry,
      userId: req.user.id,
    });
    if (newCompany) {
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

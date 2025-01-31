const JobListing = require("../models/jobListing");

exports.addJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      company,
      description,
      requiredSkills,
      jobType,
      salary,
      deadline,
    } = req.body;
    const newJobListing = await JobListing.create({
      jobTitle,
      company,
      description,
      requiredSkills,
      jobType,
      salary,
      deadline,
      userId: req.user.id,
    });
    if (newJobListing) {
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

exports.getJobListings = async (req, res, next) => {
  try {
    const jobListings = await JobListing.findAll({
      where: { userId: req.user.id },
    });
    if (jobListings) {
      return res.status(200).json({ success: true, jobListings });
    } else {
      return res.status(201);
    }
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const oldJob = await JobListing.findByPk(req.params.id);
    await oldJob.destroy();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

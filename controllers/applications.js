const Applications = require("../models/applications");

exports.addApplication = async (req, res, next) => {
  try {
    const { jobTitle, company, dateApplied, status, notes } = req.body;
    const newApplication = await Applications.create({
      jobTitle,
      company,
      dateApplied,
      status,
      notes,
      userId: req.user.id,
    });
    if (newApplication) {
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

exports.getApplication = async (req, res, next) => {
  try {
    const applications = await Applications.findAll({
      where: {
        userId: req.user.id,
      },
    });

    return res.status(200).json({ success: true, applications });
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

exports.updateApplication = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const oldApplication = await Applications.findByPk(req.params.id);
    await oldApplication.update({ status: status, notes: notes });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

exports.deleteApplication = async (req, res, next) => {
  try {
    const oldApplication = await Applications.findByPk(req.params.id);
    await oldApplication.destroy();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

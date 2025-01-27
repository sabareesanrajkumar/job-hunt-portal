const Reminders = require("../models/reminders");

exports.getReminders = async (req, res, next) => {
  try {
    return res.status(201);
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

exports.addReminder = async (req, res, next) => {
  const SibApiV3Sdk = require("sib-api-v3-sdk");
  const defaultClient = SibApiV3Sdk.ApiClient.instance;

  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  try {
    const { name, application, due, reminder } = req.body;
    const newReminder = await Reminders.create({
      name,
      application,
      due,
      reminder,
      userId: req.user.id,
    });

    const sendSmtpEmail = {
      sender: { email: "sabareesanrajkumar05@gmail.com", name: "Sabareesan" },
      to: [{ email: req.user.email, name: req.user.name }],
      subject: "Follow-up Reminder",
      htmlContent: `<p>Hey, don’t forget to follow up on your job application, ${req.body.application}, in the company ${req.body.name}</p>
      <p>Application Due${req.body.due}</p>`,
      scheduledAt: new Date(req.body.reminder).toISOString(),
    };

    apiInstance
      .sendTransacEmail(sendSmtpEmail)
      .then((data) => console.log("Reminder email scheduled:", data))
      .catch((error) => console.error(error));

    if (apiInstance) {
      return res.status(200).json({ success: true, apiInstance });
    }
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
};

const Attachments = require("../models/attachments");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_IAM_USER_ACCESS_KEY,
  secretAccessKey: process.env.AWS_IAM_USER_SECRET_KEY,
});

exports.upload = async (req, res) => {
  try {
    const { applicationId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileContent = req.file.buffer;
    const fileName = `${uuidv4()}-${req.file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: req.file.mimetype,
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).json({ error: "File upload failed" });
      }

      await Attachments.create({
        fileName: req.file.originalname,
        fileUrl: data.Location,
        fileKey: fileName,
        applicationId,
      });

      res.status(200).json({
        message: "File uploaded successfully",
        fileUrl: data.Location,
        fileKey: fileName,
      });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.download = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const fileKeyResponse = await Attachments.findAll({
      where: { applicationId: applicationId },
      attributes: ["fileKey"],
    });

    if (!fileKeyResponse || fileKeyResponse.length === 0) {
      console.error(
        "File not found in database for applicationId:",
        applicationId
      );
      return res.status(404).json({ error: "File not found in the database" });
    }

    const fileKeys = fileKeyResponse.map((item) => item.dataValues.fileKey);
    const fileData = [];

    for (const fileKey of fileKeys) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
      };

      try {
        const data = await s3.getObject(params).promise();
        const contentType = data.ContentType;
        let fileExtension = "";
        if (contentType === "image/png") {
          fileExtension = ".png";
        } else if (contentType === "application/pdf") {
          fileExtension = ".pdf";
        } else if (contentType === "application/msword") {
          fileExtension = ".doc";
        }
        fileData.push({
          fileKey,
          contentType,
          body: data.Body.toString("base64"),
          fileExtension,
        });
      } catch (err) {
        console.error("Error retrieving file from S3:", err);
        return res.status(500).json({ error: "File download failed" });
      }
    }
    res.status(200).json({ files: fileData });
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

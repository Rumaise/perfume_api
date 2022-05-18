const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

const storageEngine = multer.diskStorage({
  destination: "upload/images",
  filename: (req, file, callBack) => {
    return callBack(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storageEngine,
});

module.exports = {
  uploadStorage: upload,
  uploadDocument: (req, res) => {
    res.json({
      success: 1,
      documenturl: req.file.path,
      url: `http://${process.env.DB_HOST}:${process.env.PORT}/upload/images/${req.file.filename}`,
      base: fs.readFileSync("upload/images/" + req.file.filename, "base64"),
      contentType: req.file.mimetype,
    });
  },
};

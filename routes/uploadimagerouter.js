const { uploadDocument, uploadStorage } = require("./uploadimage");

const router = require("express").Router();
router.post("/upload", uploadStorage.single("document"), uploadDocument);
module.exports = router;

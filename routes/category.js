const express = require("express");
const category = require("../models/category");
const router = express.Router();
const { Category, validateCategory } = require("../models/category");

//POST : CREATE A NEW CATEGORY
router.post("/", async (req, res) => {
  const error = await validateCategory(req.body);
  if (error.message) res.status(400).send(error.message);
  var category = new Category({
    category_name: req.body.category_name,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });

  category
    .save()
    .then((category) => {
      res.send(category);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;

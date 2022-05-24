const express = require("express");
const router = express.Router();
const { Item, validateItem } = require("../models/item");

//POST : CREATE A NEW ITEM

router.post("/createitem", async (req, res) => {
  const error = await validateItem(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });

  var item = new Item({
    item_name: req.body.item_name,
    description: req.body.description,
    type: req.body.type,
    created_date: req.body.created_date,
    created_by: req.body.created_by,
    modified_date: req.body.modified_date,
    modified_by: req.body.modified_by,
  });

  item
    .save()
    .then((item) => {
      res.send({
        status: 1,
        data: item,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//GET ALL PROJECTS
router.get("/itemslist/:term?", (req, res) => {
  console.log(req.params.term);
  Item.find({ item_name: { $regex: ".*" + req.params.term + ".*" } })
    .then((items) =>
      res.send({
        status: 1,
        data: items,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

module.exports = router;

const express = require("express");
const { default: mongoose } = require("mongoose");
const { Project } = require("../models/project");
const router = express.Router();
const { ProjectItem, validateProjectItem } = require("../models/projectitems");

// POST : CREATE A NEW  PROJECT ITEM

router.post("/createprojectitem", async (req, res) => {
  const error = await validateProjectItem(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var projectitem = new ProjectItem({
    project_id: req.body.project_id,
    item_id: req.body.item_id,
    available_quantity: req.body.available_quantity,
    allocated_quantity: req.body.allocated_quantity,
    total_quantity: req.body.total_quantity,
    required_quantity: req.body.required_quantity,
    balance_quantity: req.body.balance_quantity,
    order_referrence: req.body.order_referrence,
    vendor_name: req.body.vendor_name,
    order_date: req.body.order_date,
    remarks: req.body.remarks,
    expected_delivery_date: req.body.expected_delivery_date,
    received_date: req.body.received_date,
    created_by: req.body.created_by,
  });
  projectitem
    .save()
    .then((projectitem) => {
      res.send({
        status: 1,
        data: projectitem,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

router.get("/projectitemslist", (req, res) => {
  ProjectItem.find()
    .then((projectitems) =>
      res.send({
        status: 1,
        data: projectitems,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

router.get("/projectitemsbyid/:id", (req, res) => {
  ProjectItem.aggregate([
    {
      $match: { project_id: { $eq: mongoose.Types.ObjectId(req.params.id) } },
    },
  ])
    .then((projectitems) =>
      res.send({
        status: 1,
        data: projectitems,
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

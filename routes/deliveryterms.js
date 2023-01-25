const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const {
  DeliveryTerms,
  validateDeliveryTerms,
} = require("../models/deliveryterms");

//POST : CREATE A NEW  SUB CATEGORY
router.post("/createdeliveryterm", async (req, res) => {
  const error = await validateDeliveryTerms(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var deliveryterm = new DeliveryTerms({
    delivery_term_name: req.body.delivery_term_name,
    created_by: req.body.created_by,
  });
  deliveryterm
    .save()
    .then((deliveryterm) => {
      res.send({
        status: 1,
        data: deliveryterm,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//GET ALL CATEGORIES
router.get("/listdeliveryterms", (req, res) => {
  DeliveryTerms.find()
    .then((deliveryterms) =>
      res.send({
        status: 1,
        data: deliveryterms,
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

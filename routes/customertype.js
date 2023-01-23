const express = require("express");
const router = express.Router();
const {
  CustomerType,
  validateCustomerType,
} = require("../models/customertype");

//POST : CREATE A CUSTOMER TYPE
router.post("/createcustomertype", async (req, res) => {
  const error = await validateCustomerType(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var customertype = new CustomerType({
    customer_type: req.body.customer_type,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });
  customertype
    .save()
    .then((customertype) => {
      res.send({
        status: 1,
        data: customertype,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

router.get("/customertypelist", (req, res) => {
  CustomerType.find()
    .then((customertype) =>
      res.send({
        status: 1,
        data: customertype,
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

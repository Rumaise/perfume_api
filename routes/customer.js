const express = require("express");
const customer = require("../models/customer");
const router = express.Router();
const { Customer, validateCustomer } = require("../models/customer");

//POST : CREATE A NEW  CUSTOMER
router.post("/createcustomer", async (req, res) => {
  const error = await validateCustomer(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var customer = new Customer({
    salutation: req.body.salutation,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    location: req.body.location,
    companyname: req.body.companyname,
    address: req.body.address,
    trn: req.body.trn,
    type: req.body.type,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
  });

  customer
    .save()
    .then((customer) => {
      res.send({
        status: 1,
        data: customer,
      });
    })
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error,
      });
    });
});

//SEARCH CUSTOMER BY PHONE
router.get("/searchcustomer/:term", (req, res) => {
  console.log(req.params.term);
  Customer.find({ phone: { $regex: ".*" + req.params.term + ".*" } })
    .then((customer) =>
      res.send({
        status: 1,
        data: customer,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//GET ALL CUSTOMERS
router.get("/customerslist", (req, res) => {
  Customer.find()
    .then((customer) =>
      res.send({
        status: 1,
        data: customer,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

//GET THE CUSTOMER BY ID
router.get("/:id", async (req, res) => {
  const subcategorydetails = await SubCategory.findById(req.params.id);
  if (!subcategorydetails)
    res.status(404).send({
      status: 0,
      data: "Sub Category Details Not Found",
    });
  res.send({
    status: 1,
    data: subcategorydetails,
  });
});

//UPDATE SUB CATEGORY BASED ON ID
router.put("/:id", async (req, res) => {
  const customerupdate = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      modified_by: req.body.modified_by,
    },
    { new: true }
  );
  if (!customerupdate)
    res.status(404).send({
      status: 0,
      data: "Customer Details Not Found",
    });
  res.send({
    status: 1,
    data: customerupdate,
  });
});

//DELETE A CUSTOMER
router.delete("/:id", async (req, res) => {
  const customerdelete = await Customer.findByIdAndRemove(req.params.id);
  if (!customerdelete)
    res.status(404).send({
      status: 0,
      data: "Customer Details Not Found",
    });
  res.send({
    status: 1,
    data: customerdelete,
  });
});

module.exports = router;

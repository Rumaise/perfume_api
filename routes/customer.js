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
    officecontact: req.body.officecontact,
    location: req.body.location,
    address: req.body.address,
    typeofcustomer: req.body.typeofcustomer,
    howyouhearaboutus: req.body.howyouhearaboutus,
    refferedby: req.body.refferedby,
    companyname: req.body.companyname,
    licenseno: req.body.licenseno,
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
router.get("/searchcustomer/:term?", (req, res) => {
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

//SEARCH CUSTOMER BY NAME
router.get("/searchcustomerbyfield/:count/:term?", (req, res) => {
  console.log(req.params.count);
  Customer.find({
    $or: [
      { firstname: { $regex: ".*" + req.params.term + ".*" } },
      { lastname: { $regex: ".*" + req.params.term + ".*" } },
      { email: { $regex: ".*" + req.params.term + ".*" } },
      { location: { $regex: ".*" + req.params.term + ".*" } },
      { phone: { $regex: ".*" + req.params.term + ".*" } },
    ],
  })
    .limit(req.params.count)
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
    .sort({ firstname: 1 })
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

router.get("/customerscount", (req, res) => {
  Customer.estimatedDocumentCount()
    .then((customerscount) =>
      res.send({
        status: 1,
        data: customerscount,
      })
    )
    .catch((error) => {
      res.status(500).send({
        status: 0,
        data: error.message,
      });
    });
});

router.get("/customerslistbypaginate/:page/:count", (req, res) => {
  Customer.aggregatePaginate(
    Customer.aggregate([{ $sort: { firstname: 1 } }]),
    { page: req.params.page, limit: req.params.count }
  )
    .then((customers) =>
      res.send({
        status: 1,
        data: customers,
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
  const subcategorydetails = await Customer.findById(req.params.id);
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

//UPDATE CUSTOMER DETAILS BASED ON ID
router.put("/customerupdate/:id", async (req, res) => {
  const customerupdate = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      companyname: req.body.companyname,
      address: req.body.address,
      trn: req.body.trn,
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

const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { PaymentTerms, validatePaymentTerms } = require("../models/paymentterm");

//POST : CREATE A NEW  SUB CATEGORY
router.post("/createpaymentterm", async (req, res) => {
  const error = await validatePaymentTerms(req.body);
  if (error.message)
    res.status(400).send({
      status: 0,
      data: error.message,
    });
  var paymentterm = new PaymentTerms({
    payment_term_name: req.body.payment_term_name,
    created_by: req.body.created_by,
  });
  paymentterm
    .save()
    .then((paymentterm) => {
      res.send({
        status: 1,
        data: paymentterm,
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
router.get("/listpaymentterms", (req, res) => {
  PaymentTerms.find()
    .then((paymentterms) =>
      res.send({
        status: 1,
        data: paymentterms,
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

const mongoose = require("mongoose");
const yup = require("yup");

// sub category schema
const PaymentTermsSchema = new mongoose.Schema({
  payment_term_name: {
    type: String,
    required: true,
    minlength: 0,
    maxlength: 50,
  },
  active: {
    type: String,
    enum: ["Y", "N"],
    default: "Y",
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: String,
    required: true,
  },
  modified_date: {
    type: Date,
    default: Date.now,
  },
  modified_by: {
    type: String,
  },
});

const validatePaymentTerms = (paymentterms) => {
  const schema = yup.object().shape({
    payment_term_name: yup.string().required().min(0).max(50),
    created_by: yup.string().required(),
  });

  return schema
    .validate(paymentterms)
    .then((paymentterms) => paymentterms)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.PaymentTerms = new mongoose.model("paymentterms", PaymentTermsSchema);
exports.validatePaymentTerms = validatePaymentTerms;

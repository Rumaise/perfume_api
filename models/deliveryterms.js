const mongoose = require("mongoose");
const yup = require("yup");

// delivery term schema
const DeliveryTermsSchema = new mongoose.Schema({
  delivery_term_name: {
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

const validateDeliveryTerms = (deliveryterms) => {
  const schema = yup.object().shape({
    delivery_term_name: yup.string().required().min(0).max(50),
    created_by: yup.string().required(),
  });

  return schema
    .validate(deliveryterms)
    .then((deliveryterms) => deliveryterms)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.DeliveryTerms = new mongoose.model(
  "deliveryterms",
  DeliveryTermsSchema
);
exports.validateDeliveryTerms = validateDeliveryTerms;

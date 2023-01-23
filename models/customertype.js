const mongoose = require("mongoose");
const yup = require("yup");

//customer type schema
const CustomerTypeSchema = new mongoose.Schema({
  customer_type: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
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

const validateCustomerType = (customertype) => {
  const schema = yup.object().shape({
    customer_type: yup.string().required().min(3).max(50),
    created_by: yup.string().required(),
  });

  return schema
    .validate(customertype)
    .then((customertype) => customertype)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.CustomerType = new mongoose.model("customertype", CustomerTypeSchema);
exports.validateCustomerType = validateCustomerType;

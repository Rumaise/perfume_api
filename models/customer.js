const mongoose = require("mongoose");
const yup = require("yup");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//customer schema
const CustomerSchema = new mongoose.Schema({
  salutation: {
    type: String,
  },
  firstname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastname: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 10,
  },
  location: {
    type: String,
    minlength: 0,
    maxlength: 50,
  },
  companyname: {
    type: String,
    minlength: 0,
    maxlength: 50,
  },
  address: {
    type: String,
    minlength: 0,
    maxlength: 50,
  },
  trn: {
    type: String,
    minlength: 0,
    maxlength: 50,
  },
  type: {
    type: String,
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

CustomerSchema.plugin(aggregatePaginate);

const validateCustomer = (customer) => {
  const schema = yup.object().shape({
    firstname: yup.string().required().min(3).max(50),
    phone: yup.string().required().min(3).max(10),
    created_by: yup.string().required(),
  });

  return schema
    .validate(customer)
    .then((customer) => customer)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.Customer = new mongoose.model("customer", CustomerSchema);
exports.validateCustomer = validateCustomer;

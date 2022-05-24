const mongoose = require("mongoose");
const yup = require("yup");

//project item schema
const ProjectItemSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects",
    required: true,
  },
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "items",
    required: true,
  },
  available_quantity: {
    type: Number,
    required: true,
  },
  allocated_quantity: {
    type: Number,
    required: true,
  },
  total_quantity: {
    type: Number,
    required: true,
  },
  required_quantity: {
    type: Number,
    required: true,
  },
  balance_quantity: {
    type: Number,
    required: true,
  },
  order_referrence: {
    type: String,
    required: true,
  },
  vendor_name: {
    type: String,
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  remarks: {
    type: String,
  },
  expected_delivery_date: {
    type: Date,
    default: undefined,
  },
  received_date: {
    type: Date,
    default: undefined,
  },
  completed: {
    type: String,
    enum: ["Y", "N"],
    default: "N",
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

const validateProjectItem = (projectitem) => {
  const schema = yup.object().shape({
    project_id: yup.string().required(),
    item_id: yup.string().required(),
    available_quantity: yup.number().required(),
    allocated_quantity: yup.number().required(),
    total_quantity: yup.number().required(),
    required_quantity: yup.number().required(),
    balance_quantity: yup.number().required(),
    order_referrence: yup.string().required(),
    vendor_name: yup.string().required(),
    created_by: yup.string().required(),
  });

  return schema
    .validate(projectitem)
    .then((projectitem) => projectitem)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.ProjectItem = new mongoose.model("projectitems", ProjectItemSchema);
exports.validateProjectItem = validateProjectItem;

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
    type: String,
    required: true,
  },
  available_quantity: {
    type: Number,
    default: 0,
  },
  allocated_quantity: {
    type: Number,
    default: 0,
  },
  total_quantity: {
    type: Number,
    default: 0,
  },
  required_quantity: {
    type: Number,
    default: 0,
  },
  balance_quantity: {
    type: Number,
    default: 0,
  },
  order_referrence: {
    type: String,
    default: undefined,
  },
  vendor_name: {
    type: String,
    default: undefined,
  },
  order_date: {
    type: Date,
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

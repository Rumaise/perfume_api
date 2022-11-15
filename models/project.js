const mongoose = require("mongoose");
const yup = require("yup");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//project schema
const ProjectSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
    required: true,
  },
  project_datetime: {
    type: Date,
    default: Date.now,
  },
  referrence: {
    type: String,
    required: true,
  },
  brandname: {
    type: String,
    // required: true,
    minlength: 0,
    maxlength: 50,
  },
  productname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  producttype: {
    type: String,
  },
  variantname: {
    type: String,
    // required: true,
    minlength: 0,
    maxlength: 50,
  },
  start_datetime: {
    type: Date,
  },
  handover_datetime: {
    type: Date,
  },
  approved_by: {
    type: String,
  },
  approved_datetime: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  categories_added: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  quantity: {
    type: Number,
    required: true,
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

ProjectSchema.plugin(aggregatePaginate);

const validateProject = (project) => {
  const schema = yup.object().shape({
    customer_id: yup.string().required().min(3).max(50),
    referrence: yup.string().required(),
    brandname: yup.string().required().min(3).max(50),
    productname: yup.string().required().min(3).max(50),
    variantname: yup.string().required().min(3).max(50),
    quantity: yup.number().required(),
    created_by: yup.string().required(),
  });

  return schema
    .validate(project)
    .then((project) => project)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.Project = new mongoose.model("projects", ProjectSchema);
exports.validateProject = validateProject;

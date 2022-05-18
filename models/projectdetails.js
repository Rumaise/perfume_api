const mongoose = require("mongoose");
const yup = require("yup");

//project details schema
const ProjectDetailSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects",
    required: true,
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
    required: true,
  },
  main_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  sub_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategory",
    required: true,
  },
  item_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategoryitems",
    required: true,
  },
  remarks: {
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

const validateProjectDetails = (projectdetails) => {
  const schema = yup.object().shape({
    project_id: yup.string().required(),
    customer_id: yup.string().required(),
    main_category_id: yup.string().required(),
    sub_category_id: yup.string().required(),
    item_category_id: yup.string().required(),
    created_by: yup.string().required(),
  });

  return schema
    .validate(projectdetails)
    .then((projectdetails) => projectdetails)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.ProjectDetailSchema = ProjectDetailSchema;
exports.ProjectDetails = new mongoose.model(
  "projectdetails",
  ProjectDetailSchema
);
exports.validateProjectDetails = validateProjectDetails;

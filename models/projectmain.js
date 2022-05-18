const mongoose = require("mongoose");
const yup = require("yup");

//project main schema
const ProjectMainSchema = new mongoose.Schema({
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
  detailname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  itemcode: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  volume: {
    type: String,
  },
  remarks: {
    type: String,
  },
  photolink: {
    data: Buffer,
    contentType: String,
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

const validateProjectMain = (projectmain) => {
  const schema = yup.object().shape({
    project_id: yup.string().required(),
    customer_id: yup.string().required(),
    main_category_id: yup.string().required(),
    detailname: yup.string().required().min(3).max(50),
    itemcode: yup.string().required().min(3).max(50),
    created_by: yup.string().required(),
  });

  return schema
    .validate(projectmain)
    .then((projectmain) => projectmain)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.ProjectMain = new mongoose.model("projectmain", ProjectMainSchema);
exports.validateProjectMain = validateProjectMain;

const mongoose = require("mongoose");
const yup = require("yup");

//process schema

const ProcessSchema = new mongoose.Schema({
  process_name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  approvers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  notify: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  mailstat: {
    type: Boolean,
    default: false,
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

const validateProcess = (process) => {
  const schema = yup.object().shape({
    process_name: yup.string().required().min(3),
    created_by: yup.string().required(),
  });
  return schema
    .validate(process)
    .then((process) => process)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.Process = new mongoose.model("process", ProcessSchema);
exports.validateProcess = validateProcess;

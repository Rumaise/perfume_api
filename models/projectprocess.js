const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const yup = require("yup");

//project process schema

function addDays(days) {
  var date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

const ProjectProcessSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects",
    required: true,
  },
  process_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "process",
    required: true,
  },
  process_started_date: {
    type: Date,
    default: Date.now,
  },
  process_end_date: {
    type: Date,
    default: addDays(7),
  },
  completed: {
    type: Boolean,
    default: false,
  },
  remarks: {
    type: String,
  },
  notified: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  selected: {
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

ProjectProcessSchema.plugin(mongoosePaginate);

const validateProjectProcess = (projectprocess) => {
  const schema = yup.object().shape({
    project_id: yup.string().required(),
    process_id: yup.string().required(),
    created_by: yup.string().required(),
  });
  return schema
    .validate(projectprocess)
    .then((projectprocess) => projectprocess)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.ProjectProcess = new mongoose.model(
  "projectprocess",
  ProjectProcessSchema
);

exports.validateProjectProcess = validateProjectProcess;

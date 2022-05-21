const mongoose = require("mongoose");
const yup = require("yup");

const UserSchema = new mongoose.Schema({
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
  designation: {
    type: String,
  },
  user_group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usergroups",
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
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

const validateUser = (user) => {
  const schema = yup.object().shape({
    firstname: yup.string().required().min(3).max(50),
    lastname: yup.string().required().min(3).max(50),
    email: yup.string().required().min(3).max(50),
    phone: yup.string().required().min(3).max(10),
    designation: yup.string(),
    user_group: yup.string().required(),
    username: yup.string().required().min(3).max(50),
    password: yup.string().required().min(3),
    created_by: yup.string().required(),
  });

  return schema
    .validate(user)
    .then((user) => user)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.UserSchema = new mongoose.model("users", UserSchema);
exports.validateUser = validateUser;

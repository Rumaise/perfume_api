const mongoose = require("mongoose");
const yup = require("yup");

const UserGroupSchema = new mongoose.Schema({
  group_name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  access_list: [
    {
      section_name: {
        type: String,
        required: true,
      },
      selected: {
        type: Boolean,
        default: false,
      },
    },
  ],
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

const validateUserGroup = (usergroup) => {
  const schema = yup.object().shape({
    group_name: yup.string().required().min(3).max(50),
    created_by: yup.string().required(),
  });

  return schema
    .validate(usergroup)
    .then((usergroup) => usergroup)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.UserGroup = new mongoose.model("usergroups", UserGroupSchema);
exports.validateUserGroup = validateUserGroup;

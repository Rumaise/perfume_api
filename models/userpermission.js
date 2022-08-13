const mongoose = require("mongoose");
const yup = require("yup");

//category schema
const UserPermissionSchema = new mongoose.Schema({
  screen: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
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

const validateUserPermission = (userpermission) => {
  const schema = yup.object().shape({
    screen: yup.string().required().min(3).max(50),
    created_by: yup.string().required(),
  });

  return schema
    .validate(userpermission)
    .then((userpermission) => userpermission)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.UserPermission = new mongoose.model(
  "permissionschecklist",
  UserPermissionSchema
);
exports.validateUserPermission = validateUserPermission;

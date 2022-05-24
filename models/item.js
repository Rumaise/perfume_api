const mongoose = require("mongoose");
const yup = require("yup");

//items schema
const ItemSchema = new mongoose.Schema({
  item_name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
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

const validateItem = (item) => {
  const schema = yup.object().shape({
    item_name: yup.string().required().min(3),
    created_by: yup.string().required(),
  });

  return schema
    .validate(item)
    .then((item) => item)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.Item = new mongoose.model("items", ItemSchema);
exports.validateItem = validateItem;

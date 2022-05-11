const mongoose = require("mongoose");
const yup = require("yup");

//category schema
const CategorySchema = new mongoose.Schema({
  category_name: {
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

const validateCategory = (category) => {
  const schema = yup.object().shape({
    category_name: yup.string().required().min(3).max(50),
    created_by: yup.string().required(),
  });

  return schema
    .validate(category)
    .then((category) => category)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.Category = new mongoose.model("category", CategorySchema);
exports.validateCategory = validateCategory;

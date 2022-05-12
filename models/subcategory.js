const mongoose = require("mongoose");
const yup = require("yup");

// sub category schema
const SubCategorySchema = new mongoose.Schema({
  category_id: {
    type: String,
    required: true,
  },
  sub_category_name: {
    type: String,
    required: true,
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

const validateSubCategory = (subcategory) => {
  const schema = yup.object().shape({
    category_id: yup.string().required(),
    sub_category_name: yup.string().required().min(3).max(50),
    created_by: yup.string().required(),
  });

  return schema
    .validate(subcategory)
    .then((subcategory) => subcategory)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.SubCategory = new mongoose.model("subcategory", SubCategorySchema);
exports.validateSubCategory = validateSubCategory;

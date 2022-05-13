const mongoose = require("mongoose");
const yup = require("yup");

// sub category schema
const SubCategoryItemsSchema = new mongoose.Schema({
  sub_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategory",
    required: true,
  },
  item_name: {
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

const validateSubCategoryItems = (subcategoryitems) => {
  const schema = yup.object().shape({
    sub_category_id: yup.string().required(),
    item_name: yup.string().required().min(3).max(50),
    created_by: yup.string().required(),
  });

  return schema
    .validate(subcategoryitems)
    .then((subcategoryitems) => subcategoryitems)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.SubCategoryItems = new mongoose.model(
  "subcategoryitems",
  SubCategoryItemsSchema
);
exports.validateSubCategoryItems = validateSubCategoryItems;

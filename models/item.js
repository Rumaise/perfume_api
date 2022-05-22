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
});

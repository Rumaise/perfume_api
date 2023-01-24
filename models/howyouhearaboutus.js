const mongoose = require("mongoose");
const yup = require("yup");

//how you hear about us schema
const HowYouHearAboutUsSchema = new mongoose.Schema({
  how_you_hear_about_us: {
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

const validateHowYouHearAboutUs = (howyouhearaboutus) => {
  const schema = yup.object().shape({
    how_you_hear_about_us: yup.string().required().min(3).max(50),
    created_by: yup.string().required(),
  });

  return schema
    .validate(howyouhearaboutus)
    .then((howyouhearaboutus) => howyouhearaboutus)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.HowYouHearAboutUs = new mongoose.model(
  "howyouhearaboutus",
  HowYouHearAboutUsSchema
);
exports.validateHowYouHearAboutUs = validateHowYouHearAboutUs;

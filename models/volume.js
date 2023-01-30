const mongoose = require("mongoose");
const yup = require("yup");

// volume schema
const VolumeSchema = new mongoose.Schema({
  volume_name: {
    type: String,
    required: true,
    minlength: 0,
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

const validateVolume = (volume) => {
  const schema = yup.object().shape({
    volume_name: yup.string().required().min(0).max(50),
    created_by: yup.string().required(),
  });

  return schema
    .validate(volume)
    .then((volume) => volume)
    .catch((error) => {
      return {
        message: error.message,
      };
    });
};

exports.Volume = new mongoose.model("volumemaster", VolumeSchema);
exports.validateVolume = validateVolume;

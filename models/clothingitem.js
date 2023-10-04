const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "Link is not a valid URL",
    },
  },
  // owner: {
  //   required: true,
  //   type: mongoose.Schema.Types.ObjectId,
  // },
  // likes: {
  //   type:
  //   default: "",
  //   ref: "user"
  // },
  // createdAt: {
  //   type: Date,
  //   default: Date.now
  // },
});

module.exports = mongoose.model("clothingItem", clothingItem);

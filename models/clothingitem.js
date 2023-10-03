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
      validator: (v) => {
        return validator.isURL(v);
      },
      message: "Link is not Valid ",
    },
  },
  // owner: {
  //   required: true,
  //   type: mongoose.Schema.Types.ObjectId,
  // },
  // likes: {},
  // createdAt: {
  //   type: Date,
  // },
});

module.exports = mongoose.model("clothingItem", clothingItem);

const mongoose = require("mongoose");
const validator = require("validator");

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "Link is not a valid URL",
    },
  },
});

module.exports = mongoose.model("user", user);

// validator.isURL(v, {
//   protocols: ["http", "https", "ftp", ".com"],
//   require_tld: true,
//   require_protocol: true,
// });

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { db } = require("./clothingitem");

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
  email: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "This email has been used",
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

//check to see if the password is correct

// within findUserByCredentials a problem occurs when you add return before promise.reject on line 57

user.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      console.log(password, user.password);
      if (!user) {
        return Promise.reject(new Error("Nonexistent user"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          console.log(matched, "this is the matched data");
          console.log({ user });
          console.log({ pwd: password, usr: user.password, e: user.email });
          console.log("the problem is here");
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", user);

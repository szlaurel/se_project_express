const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
// const { db } = require("./clothingitem");

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "this is the minlength"],
    maxlength: [30, "this is the maxlength"],
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

// check to see if the password is correct

// within findUserByCredentials a problem occurs when you add return before promise.reject on line 57

user.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select("+password")
    .then((userInfo) => {
      // console.log(password, userInfo.password);
      console.log(
        userInfo,
        "this is where the null comes from in user.Statics.findUserByCredentials just in case it shows null",
      );
      if (!userInfo) {
        return Promise.reject(new Error("Nonexistent userInfo"));
      }
      return bcrypt.compare(password, userInfo.password).then((matched) => {
        if (!matched) {
          console.log(matched, "this is the matched data");
          console.log({ userInfo });
          console.log({
            pwd: password,
            usr: userInfo.password,
            e: userInfo.email,
          });
          console.log("the problem is here");
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return userInfo;
      });
    });
};

module.exports = mongoose.model("user", user);

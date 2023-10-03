const mongoose = require('mongoose');
const validator = require('validator');

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
    validate: (v) => {
      validator.isURL(v);
    },
    message: 'Link is not Valid for avatar',
  },
});

module.exports = mongoose.model('user', user);

const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
const { validate } = require("../models/user");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.createClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "ImageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateUrl),
    email: Joi.string().custom(validateEmail),
    password: Joi.string(),
  }),
  params: Joi.object().keys({}),
});

module.exports.authenticateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string(),
  }),
});

module.exports.userAndClothingIds = celebrate({
  body: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
});

module.exports.validateItemIds = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().length(24),
  }),
});

module.exports.validateUserIds = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
});

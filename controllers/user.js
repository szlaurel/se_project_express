// const user = require("../models/user");
// const { validate } = require("../models/user");
const User = require("../models/user");
const {
  CAST_ERROR_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

// basic roadmap to follow when passing error requests to the other requests VVV

// tasks for create user
// need to tell the validator that "https://thisisnotvalidurl", <https://x~>! is not a valid url
// fix for the validator was to just fix it in the schema

// there just needs to be one if statement that deals with the validation error

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      console.log("im here in then");
      console.log(user);
      console.log(avatar);
      res.send({ data: user });
    })
    .catch((error) => {
      console.log("im here n catch");
      console.log(error.name);
      console.log(name);
      if (error.name === "ValidationError") {
        res
          .status(CAST_ERROR_ERROR_CODE)
          .send({ message: "Name is under  or over character limit" });
      } else {
        console.log(error.name);
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "Error from createUser" });
      }
    });
};

// write if statements in the catch blocks that catch the specific types of errors

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((error) => {
      console.log("im here in catch");
      console.log(error.name);
      console.log(error.statusCode);
      if (error.name === "CastError") {
        res
          .status(CAST_ERROR_ERROR_CODE)
          .send({ message: "Cast Error occurred", error });
      } else if (error.statusCode === NOT_FOUND_ERROR_CODE) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "id is incorrect or does not exist", error });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "Error from createUser" });
        console.log(error.name);
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((e) => {
      console.log(e.name);
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from createUser" });
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
};

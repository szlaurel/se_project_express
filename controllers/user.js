const user = require("../models/user");
const User = require("../models/user");
const {
  CAST_ERROR_ERROR_CODE,
  VALIDATION_DATA_CODE,
  NOT_FOUND_DATA_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

// basic roadmap to follow when passing error requests to the other requests VVV

// tasks for create user
// need to tell the validator that "https://thisisnotvalidurl", <https://x~>! is not a valid url

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      console.log("im here ");
      console.log(user);
      res.send({ data: user });
    })
    .catch((error) => {
      console.log("im here n catch");

      console.log(error.name);
      console.log(name);
      if (error.name === "ValidationError" || name.length < 2) {
        res
          .status(CAST_ERROR_ERROR_CODE)
          .send({ message: "Name is under character limit" });
      } else if (error.name === "ValidationError" || name.length > 30) {
        res
          .status(CAST_ERROR_ERROR_CODE)
          .send({ message: "Name is past character limit" });
      } else {
        console.log(error.name);
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "Error from createUser", error });
      }
    });
};

// write if statements in the catch blocks that catch the specific types of errors

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NOT_FOUND_DATA_CODE;
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((e) => {
      // if (e.name === "CastError") {
      // }
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from createUser", e });
      console.log(e.name);
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
        .send({ message: "Error from createUser", e });
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
};

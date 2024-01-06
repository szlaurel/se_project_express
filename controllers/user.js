const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const user = require("../models/user");
// const { validate } = require("../models/user");
// const User = require("../models/user");
// Need to destructure the JWT_SECRET when importing it
// const { JWT_SECRET } = require("../utils/config");
const { jwtSecret } = require("../utils/config");
const {
  CAST_ERROR_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  VALIDATION_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require("../utils/errors");

const { BadRequestError } = require("../errors/BadRequestError");
const { UnauthorizedError } = require("../errors/UnauthorizedError");
const { ForbiddenError } = require("../errors/ForbiddenError");
const { NotFoundError } = require("../errors/NotFoundError");
const { ConflictError } = require("../errors/ConflictError");

const createUser = (req, res) => {
  const { name, avatar, email } = req.body;
  user
    .findOne({ email })
    .then((existingUser) => {
      if (existingUser !== null) {
        const error = new Error("Email already exists");
        error.statusCode = CONFLICT_ERROR_CODE;
        throw error;
      }
      bcrypt.hash(req.body.password, 10).then((hash) =>
        user
          .create({ name, avatar, email, password: hash })
          .then((userInfo) => {
            console.log("im here in then for createUser");
            console.log(userInfo);
            console.log(userInfo._id);
            res.status(201).send({
              name: req.body.name,
              avatar: req.body.avatar,
              email: req.body.email,
            });
          })
          .catch((error) => {
            console.log("im here n catch for createUser");
            console.log(error);
            console.log(name);
            if (error.name === "ValidationError") {
              next(new BadRequestError(error.message));
              // res
              //   .status(VALIDATION_ERROR_CODE)
              //   .send({ message: error.message });
            } else {
              next(error);
              // console.log(error.name);
              // res
              //   .status(INTERNAL_SERVER_ERROR_CODE)
              //   .send({ message: "Error from createUser" });
            }
          }),
      );
    })
    .catch((e) => {
      console.log(e);
      if (e.statusCode === CONFLICT_ERROR_CODE) {
        // Handle the MongoDB duplicate key error for the 'email' field
        next(new ConflictError("Email already exists"));
      } else {
        next(e);
      }
    });
  // .catch((error) => {
  //   console.log("im here n catch for createUser");
  //   console.log(error);
  //   console.log(name);
  //   if (error.name === "ValidationError") {
  //     res
  //       .status(CAST_ERROR_ERROR_CODE)
  //       .send({ message: "Name is under or over character limit" });
  //   } else if (error.statusCode === CONFLICT_ERROR_CODE) {
  //     // Handle the MongoDB duplicate key error for the 'email' field
  //     res
  //       .status(CONFLICT_ERROR_CODE)
  //       .send({ message: "Email already exists" });
  //   } else {
  //     console.log(error.name);
  //     res
  //       .status(INTERNAL_SERVER_ERROR_CODE)
  //       .send({ message: "Error from createUser", error });
  //   }
  // });
};

// write if statements in the catch blocks that catch the specific types of errors

const login = (req, res) => {
  const { email, password } = req.body;
  // add a check to see that email or pass is not null
  // in the user.findUserByCredentials i added the {} in the parameters to find the email and the password

  return user
    .findUserByCredentials(email, password)
    .then((userInfo) => {
      console.log({ e: email, p: password });
      const token = jwt.sign({ _id: userInfo._id }, jwtSecret, {
        expiresIn: "7d",
      });

      res.send({ token });

      console.log("token sent successful");
      // authentication successful! user is in the user variable
    })
    .catch((err) => {
      // authentication error
      console.log("we landed at the auth error here in the backend for login");
      console.error(err);
      next(new UnauthorizedError(err.message));
      // res.status(UNAUTHORIZED_ERROR_CODE).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  // const { userId } = req.params;
  user
    .findById(userId)
    .then((currentUser) => {
      if (!currentUser) {
        next(new NotFoundError("user not found"));
        // return res
        //   .status(NOT_FOUND_ERROR_CODE)
        //   .send({ error: "user not found" });
      }
      console.log(currentUser);
      return res.status(200).send({ data: currentUser });
    })
    .catch((e) => {
      console.log(e);
      next(e);
      // res
      //   .status(INTERNAL_SERVER_ERROR_CODE)
      //   .send({ error: "Internal server error occurred" });
    });
};

// i have a feeling that in sprint 14 they're going to ask me to create a controller regarding changing the email seperately and maybe the password and if thats the case just look onto the updateProfile for an example of how to properly change it

const updateProfile = (req, res) => {
  // This code will return failed on postman because were not sending the new email through to be updated
  const userId = req.user._id;
  // const { userId } = req.params;
  const { name, avatar } = req.body;
  console.log(userId);
  user
    .findOneAndUpdate(
      { _id: req.user._id },
      { name, avatar },
      { new: true, runValidators: true },
    )
    .then((userInfo) => {
      res.status(200).send({ data: userInfo, name, avatar });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError(error.message));
        // res
        //   .status(CAST_ERROR_ERROR_CODE)
        //   .send({ message: "Cast Error occurred" });
      } else if (error.statusCode === NOT_FOUND_ERROR_CODE) {
        next(new NotFoundError("id is incorrect or does not exist"));
        // res
        //   .status(NOT_FOUND_ERROR_CODE)
        //   .send({ message: "id is incorrect or does not exist" });
      } else if (error.name === "ValidationError") {
        next(new BadRequestError("validation error has occurred"));
        // res
        //   .status(VALIDATION_ERROR_CODE)
        //   .send({ message: "validation error has occurred" });
      } else {
        // res
        next(error);
        //   .status(INTERNAL_SERVER_ERROR_CODE)
        //   .send({ message: "Error from updateProfile" });
        console.log(error.name);
      }
    });
};

// const login = (req, res) => {
//   const { email, password } = req.body;
//   return user.findUserByCredentials({ email, password }).then((user) => {
//     if (!user) {
//       return Promise.reject(new Error("Incorrect email or password"));
//     }
//     return bcrypt.compare;
//   });
// };

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};

// getUser,
/* -------------------------------------------------------------------------- */
/*                                    Notes                                   */
/* -------------------------------------------------------------------------- */
// I modified the create user code to take email and password and to hask out password and to send the information back

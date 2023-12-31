// middleware/auth.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { jwtSecret } = require("../utils/config");
const { UnauthorizedError } = require("../errors/UnauthorizedError");

console.log(JWT_SECRET);

const auth = (req, res, next) => {
  // get authorization from the header by destructuring
  const { authorization } = req.headers;

  // check that the header exists and starts with 'Bearer '
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("hello");
    throw new UnauthorizedError("Authorization required");
  }

  // auth header exists and is in correct format
  // so extract the token from the header
  const token = authorization.replace("Bearer ", "");

  // if token is verified, save the payload
  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    // otherwise, return an error
    console.log("hello from the catch block");
    console.error(err);
    throw new UnauthorizedError("Authorization required");
  }

  /* Save payload to request. This makes the payload available
   to the latter parts of the route. See the `Accessing user
   data with req.user` example for details. */
  req.user = payload;

  // sending the request to the next middleware
  return next();
};

module.exports = { auth };

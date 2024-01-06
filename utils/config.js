const { JWT_SECRET } = process.env;

const jwtSecret =
  process.env.NODE_ENV === "production" ? JWT_SECRET : "default-value-for-dev";

module.exports = {
  jwtSecret,
  // JWT_SECRET: "my-secret-key",
};

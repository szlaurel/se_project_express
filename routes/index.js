const router = require("express").Router();
const clothingItem = require("./clothingItem");
const user = require("./user");
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");
const { login, createUser } = require("../controllers/user");
// const { auth } = require("../middleware/auth");
const {
  authenticateUser,
  createUserValidation,
  validateItemIds,
  validateUserIds,
} = require("../middleware/validation");

router.post("/signin", authenticateUser, login);
router.post("/signup", createUserValidation, createUser);
router.use("/items", validateItemIds, clothingItem);
router.use("/users", validateUserIds, user);

/* -------------------------------------------------------------------------- */
/*                  Original router.use code for the project                  */
/* -------------------------------------------------------------------------- */
router.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: "Router not found" });
});

/* -------------------------------------------------------------------------- */
/*                     modified version to see if it works                    */
/* -------------------------------------------------------------------------- */

module.exports = router;

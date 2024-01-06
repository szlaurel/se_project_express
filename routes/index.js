const router = require("express").Router();
const clothingItem = require("./clothingItem");
const user = require("./user");
const { login, createUser } = require("../controllers/user");
// const { auth } = require("../middleware/auth");
const { NotFoundError } = require("../errors/NotFoundError");
const {
  authenticateUser,
  createUserValidation,
  validateItemIds,
  validateUserIds,
} = require("../middleware/validation");

router.post("/signin", authenticateUser, login);
router.post("/signup", createUserValidation, createUser);
router.use("/items", clothingItem);
router.use("/users", user);

/* -------------------------------------------------------------------------- */
/*                  Original router.use code for the project                  */
/* -------------------------------------------------------------------------- */
router.use((req, res) => {
  throw new NotFoundError("Router not found");
});

/* -------------------------------------------------------------------------- */
/*                     modified version to see if it works                    */
/* -------------------------------------------------------------------------- */

module.exports = router;

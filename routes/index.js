const router = require("express").Router();
const clothingItem = require("./clothingItem");
const user = require("./user");
const { login, createUser } = require("../controllers/user");
// const { auth } = require("../middleware/auth");
const { NotFoundError } = require("../errors/NotFoundError");
const {
  authenticateUser,
  createUserValidation,
} = require("../middleware/validation");

router.post("/signin", authenticateUser, login);
router.post("/signup", createUserValidation, createUser);
router.use("/items", clothingItem);
router.use("/users", user);

/* -------------------------------------------------------------------------- */
/*                  Original router.use code for the project                  */
/* -------------------------------------------------------------------------- */
router.use(() => {
  throw new NotFoundError("Router not found");
});

/* -------------------------------------------------------------------------- */
/*                     modified version to see if it works                    */
/* -------------------------------------------------------------------------- */

module.exports = router;

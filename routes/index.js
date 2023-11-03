const router = require("express").Router();
const clothingItem = require("./clothingItem");
const user = require("./user");
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");
const { login, createUser } = require("../controllers/user");
// const { auth } = require("../middleware/auth");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItem);
router.use("/users", user);

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

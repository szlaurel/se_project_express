const router = require("express").Router();
const clothingItem = require("./clothingItem");
const user = require("./user");

router.use("/items", clothingItem);
router.use("/users", user);

/* -------------------------------------------------------------------------- */
/*                  Original router.use code for the project                  */
/* -------------------------------------------------------------------------- */
router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

/* -------------------------------------------------------------------------- */
/*                     modified version to see if it works                    */
/* -------------------------------------------------------------------------- */

module.exports = router;

const router = require("express").Router();
const {
  createUser,
  getUser,
  getUsers,
  getCurrentUser,
  updateProfile,
} = require("../controllers/user");

// CRUD

/* -------------------------------------------------------------------------- */
/*                                   Create                                   */
/* -------------------------------------------------------------------------- */

// router.post("/", createUser);

/* -------------------------------------------------------------------------- */
/*                                    Read                                    */
/* -------------------------------------------------------------------------- */

// router.get("/:userId", getUser);
// router.get("/", getUsers);

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

// router.patch("me", updateProfile)
module.exports = router;

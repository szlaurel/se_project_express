const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/user");
const { auth } = require("../middleware/auth");

// createUser,
// getUser,
// getUsers,

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

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

// router.patch("me", updateProfile)
module.exports = router;

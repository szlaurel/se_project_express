const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/user");
const { auth } = require("../middleware/auth");

// createUser,
// getUser,
// getUsers,

const { updateUserInfo } = require("../middleware/validation");

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
router.patch("/me", updateUserInfo, auth, updateProfile);

// router.patch("me", updateProfile)
module.exports = router;

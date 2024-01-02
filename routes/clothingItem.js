const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

const { auth } = require("../middleware/auth");

const {
  userAndClothingIds,
  validateIds,
  createClothingItem,
} = require("../middleware/validation");

// CRUD

/* -------------------------------------------------------------------------- */
/*                                   Create                                   */
/* -------------------------------------------------------------------------- */

router.post("/", auth, createItem);

/* -------------------------------------------------------------------------- */
/*                                    Read                                    */
/* -------------------------------------------------------------------------- */

router.get("/", getItems);

/* -------------------------------------------------------------------------- */
/*                                   Update                                   */
/* -------------------------------------------------------------------------- */

// router.put("/:itemId", updateItem);
router.put("/:itemId/likes", auth, likeItem);

/* -------------------------------------------------------------------------- */
/*                                   Delete                                   */
/* -------------------------------------------------------------------------- */

router.delete("/:itemId", auth, deleteItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;

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
  validateItemIds,
  createClothingItem,
} = require("../middleware/validation");
const { validate } = require("../models/user");

// CRUD

/* -------------------------------------------------------------------------- */
/*                                   Create                                   */
/* -------------------------------------------------------------------------- */

router.post("/", createClothingItem, auth, createItem);

/* -------------------------------------------------------------------------- */
/*                                    Read                                    */
/* -------------------------------------------------------------------------- */

router.get("/", getItems);

/* -------------------------------------------------------------------------- */
/*                                   Update                                   */
/* -------------------------------------------------------------------------- */

// router.put("/:itemId", updateItem);
router.put("/:itemId/likes", validateItemIds, auth, likeItem);

/* -------------------------------------------------------------------------- */
/*                                   Delete                                   */
/* -------------------------------------------------------------------------- */

router.delete("/:itemId", validateItemIds, auth, deleteItem);
router.delete("/:itemId/likes", validateItemIds, auth, dislikeItem);

module.exports = router;

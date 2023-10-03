const router = require('express').Router();
const { createUser, getUser, getUsers } = require('../controllers/user');
const { userNameIsAtMinimum } = require('../middleware/users');

// CRUD

/* -------------------------------------------------------------------------- */
/*                                   Create                                   */
/* -------------------------------------------------------------------------- */

router.post('/', createUser);

/* -------------------------------------------------------------------------- */
/*                                    Read                                    */
/* -------------------------------------------------------------------------- */

router.get('/:userId', getUser);
router.get('/', getUsers);

module.exports = router;

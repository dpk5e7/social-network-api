const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  createFriend,
  deleteFriend,
} = require("../../controllers/user.controller");

// /api/users
router.route("/").get(getUsers);
router.route("/").post(createUser);

// /api/users/:userId
router.route("/:userId").get(getSingleUser);
router.route("/:userId").put(updateUser);
router.route("/:userId").delete(deleteUser);

// /api/users/:userId/friends/:friendId
router.route("/:userId/friends/:friendId").post(createFriend);
router.route("/:userId/friends/:friendId").delete(deleteFriend);

module.exports = router;

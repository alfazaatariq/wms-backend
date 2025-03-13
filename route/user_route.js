const { authentication, restrictTo } = require("../controller/auth_controller");
const {
  getAllUser,
  updateUserById,
  deleteUserById,
  createUser,
} = require("../controller/user_controller");

const router = require("express").Router();

router.route("/").get(authentication, restrictTo("1"), getAllUser);
router.route("/").post(authentication, restrictTo("1"), createUser);
router.route("/:id").put(authentication, restrictTo("1"), updateUserById);
router.route("/:id").delete(authentication, restrictTo("1"), deleteUserById);

module.exports = router;

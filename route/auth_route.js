const {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  authentication,
  restrictTo,
} = require("../controller/auth_controller");

const router = require("express").Router();

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/logout").post(logout);

router.route("/profile").get(getProfile);

router.route("/profile/:id").put(updateProfile);

module.exports = router;

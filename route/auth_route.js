const {
  signup,
  login,
  authentication,
  restrictTo,
} = require("../controller/auth_controller");

const router = require("express").Router();

router.route("/signup").post(authentication, restrictTo("1"), signup);

router.route("/login").post(login);

module.exports = router;

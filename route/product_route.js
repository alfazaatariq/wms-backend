const {
  createProduct,
  deleteProductById,
  getAllProduct,
  updateProductById,
} = require("../controller/product_controller");
const { authentication, restrictTo } = require("../controller/auth_controller");
const router = require("express").Router();

router.route("/").post(authentication, createProduct);
router.route("/").get(authentication, getAllProduct);
router.route("/:id").put(authentication, restrictTo("1"), updateProductById);
router.route("/:id").delete(authentication, restrictTo("1"), deleteProductById);

module.exports = router;

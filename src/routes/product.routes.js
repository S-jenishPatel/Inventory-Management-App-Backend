const { Router } = require("express");
const upload = require("../middlewares/multer.middleware");
const verifyJWT = require("../middlewares/authorization.middleware");
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  updateProductImage,
  deleteProduct,
} = require("../controllers/product.controller");

const router = Router();

router
  .route("/")
  .get(verifyJWT, getAllProducts)
  .post(verifyJWT, upload.single("image"), addProduct);

router
  .route("/:id")
  .get(verifyJWT, getProductById)
  .put(verifyJWT, updateProduct)
  .patch(verifyJWT, upload.single("image"), updateProductImage)
  .delete(verifyJWT, deleteProduct);

module.exports.productRouter = router;

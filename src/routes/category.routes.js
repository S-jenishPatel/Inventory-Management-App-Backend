const { Router } = require("express");
const verifyJWT = require("../middlewares/authorization.middleware");
const {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
} = require("../controllers/category.controller");

const router = Router();

router.route("/").get(verifyJWT, getAllCategories).post(verifyJWT, addCategory);

router
  .route("/:id")
  .get(verifyJWT, getCategoryById)
  .put(verifyJWT, updateCategory);

module.exports.categoryRouter = router;

const { Router } = require("express");
const upload = require("../middlewares/multer.middleware");
const verifyJWT = require("../middlewares/authorization.middleware");
const {
  signup,
  login,
  logout,
  getUser,
  updateUser,
  changeCurrentPassword,
  updateUserImage,
  regenerateTokens,
} = require("../controllers/user.controller");

const router = Router();

router.route("/signup").post(upload.single("image"), signup);

router.route("/login").patch(login);

// Authorized routes
router.route("/logout").patch(verifyJWT, logout);

router.route("/get-user").get(verifyJWT, getUser);

router.route("/update-user").put(verifyJWT, updateUser);

router
  .route("/update-image")
  .put(verifyJWT, upload.single("image"), updateUserImage);

router.route("/change-password").patch(verifyJWT, changeCurrentPassword);

router.route("/regenerate-tokens").patch(regenerateTokens);

module.exports.userRouter = router;

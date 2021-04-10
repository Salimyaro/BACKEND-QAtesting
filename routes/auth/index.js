const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth");
const { guard, guardRefresh } = require("../../helpers/guard");
// const upload = require("../../helpers/upload");
const validate = require("./validation");
const { createAccountLimiter } = require("../../helpers/rate-limit-reg");

router.post(
  "/register",
  createAccountLimiter,
  validate.user,
  authController.register
);
router.post("/login", validate.user, authController.login);
router.post("/logout", guard, authController.logout);

router.get("/google", authController.googleAuth);
router.get("/google-redirect", authController.googleRedirect);
router.post("/refresh", guardRefresh, authController.refresh);

// router.patch(
//   "/avatars",
//   [guard, upload.single("avatar"), validate.uploadAvatar],
//   userController.avatars
// );

module.exports = router;

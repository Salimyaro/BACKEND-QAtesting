const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth");
const { guard } = require("../../helpers/guard");

router.get("/", guard, authController.current);

module.exports = router;

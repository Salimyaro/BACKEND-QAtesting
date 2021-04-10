const express = require("express");
const router = express.Router();

const testsController = require("../../controllers/tests");
const { guard } = require("../../helpers/guard");

router.get("/tech", guard, testsController.getTech);
router.get("/theory", guard, testsController.getTheory);

module.exports = router;

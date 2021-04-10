const express = require("express");
const router = express.Router();

const resultsController = require("../../controllers/results");
const { guard } = require("../../helpers/guard");
const validate = require("./validation");

router.post(
  "/tech",
  [guard, validate.questions],
  resultsController.getTechResult
);
router.post(
  "/theory",
  [guard, validate.questions],
  resultsController.getTheoryResult
);

module.exports = router;

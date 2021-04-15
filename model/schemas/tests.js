const { Schema, model, SchemaTypes } = require("mongoose");

const testsSchema = new Schema(
  {
    category: {
      type: String,
    },
    question: {
      type: String,
    },
    questionId: {
      type: Number,
    },
    answers: {
      type: SchemaTypes.Array,
    },
    rightAnswer: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const Tests = model("tests", testsSchema);

module.exports = Tests;

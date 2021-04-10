const { Schema, model, SchemaTypes } = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate-v2");

// const { Subscription } = require("../../helpers/constants");

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
    // email: {
    //   type: String,
    //   match: /^.*@.*$/,
    //   required: [true, "Contact's email required"],
    // },
    // phone: {
    //   type: String,
    //   match: /^[(][\d]{3}[)]\s[\d]{3}[-][\d]{4}/,
    //   required: [
    //     true,
    //     "A phone number is required, in the format: '(099) 333-4444'",
    //   ],
    // },
    // subscription: {
    //   type: String,
    //   enum: [Subscription.FREE, Subscription.PRO, Subscription.PREMIUM],
    //   default: Subscription.FREE,
    // },
    // owner: {
    //   type: SchemaTypes.ObjectId,
    //   ref: "user",
    // },
  },
  { versionKey: false, timestamps: true }
);

// testsSchema.plugin(mongoosePaginate);
const Tests = model("tests", testsSchema);

module.exports = Tests;

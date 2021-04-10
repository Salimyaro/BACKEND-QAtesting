const { Schema, model } = require("mongoose");

const sessionSchema = new Schema(
  {
    uid: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

const Session = model("sessions", sessionSchema);

module.exports = Session;

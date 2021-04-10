const { Schema, model, SchemaTypes } = require("mongoose");
const bcrypt = require("bcryptjs");
// const gravatar = require("gravatar");

const SALT_WORK_FACTOR = 8;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email required"],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value).toLowerCase());
      },
    },
    password: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: [true, "Password required"],
    },
    // avatar: {
    //   type: String,
    //   default: function () {
    //     return gravatar.url(this.email, { s: "250" }, true);
    //   },
    // },
    sessions: {
      type: SchemaTypes.Array,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt, null);
  next();
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model("users", userSchema);

module.exports = User;

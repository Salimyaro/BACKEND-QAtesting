const Joi = require("joi");
const { HttpCode } = require("../../helpers/constants");

const schemaUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(50).alphanum().required(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `${message.replace(/"/g, "")}`,
    });
  }
  next();
};

function user(req, _res, next) {
  return validate(schemaUser, req.body, next);
}

module.exports = {
  user,
};

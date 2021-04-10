const Joi = require("joi");
const { HttpCode } = require("../../helpers/constants");

const schemaQuestions = Joi.object({
  answers: Joi.array()
    .length(12)
    .items(
      Joi.object({
        questionId: Joi.number().required(),
        answer: Joi.string().required(),
      })
    )
    .required(),
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

function questions(req, _res, next) {
  return validate(schemaQuestions, req.body, next);
}

module.exports = {
  questions,
};

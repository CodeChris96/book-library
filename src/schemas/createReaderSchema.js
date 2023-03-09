const Joi = require("joi");

const createReaderSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required.",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Email is not formatted correctly.",
  }),
  password: Joi.string().min(8).required().messages({
    "any.required": "Password is required.",
    "string.min": "Password must be at least {#limit} characters long.",
  }),
});

module.exports = createReaderSchema;

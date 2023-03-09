const Joi = require("joi");

const createBookSchema = Joi.object({
  title: Joi.string().required().max(50).messages({
    "any.required": "Title is required.",
    "string.max": "Title must be at most {#limit} characters long.",
  }),
  author: Joi.string().required().max(50).messages({
    "any.required": "Author is required.",
    "string.max": "Author must be at most {#limit} characters long.",
  }),
  genre: Joi.string().max(50).messages({
    "string.max": "Genre must be at most {#limit} characters long.",
  }),
  ISBN: Joi.string().allow("").max(50).messages({
    "string.max": "ISBN must be at most {#limit} characters long.",
  }),
});

module.exports = createBookSchema;

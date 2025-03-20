const Joi = require("joi");

exports.signupSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(64)
    .required()
    .email({ tlds: { allow: ["com", "net", "org"] } }),
  password: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});

exports.signInSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(64)
    .required()
    .email({ tlds: { allow: ["com", "net", "org"] } }),
  password: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});

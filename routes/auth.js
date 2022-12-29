const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/auth.");
const { validateFields } = require("../middlewares/validate-fields");

const route = Router();

route.get(
  "/",
  [
    check("email", "The email is required").isEmail(),
    check("password", "The password is required").not().isEmpty(),
    validateFields,
  ],
  login
);

module.exports = route;

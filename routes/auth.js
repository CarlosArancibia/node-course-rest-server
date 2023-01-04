const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleAuth } = require("../controllers/auth.");
const { validateFields } = require("../middlewares/validate-fields");

const route = Router();

route.post(
  "/login",
  [
    check("email", "The email is required").isEmail(),
    check("password", "The password is required").not().isEmpty(),
    validateFields,
  ],
  login
);

route.post(
  "/google",
  [check("id_token", "The Id_token is required").not().isEmpty(), validateFields],
  googleAuth
);

module.exports = route;

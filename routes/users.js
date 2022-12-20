const { Router } = require("express");
const { check } = require("express-validator");
const { getUsers, postUsers, putUsers, patchUsers, deleteUsers } = require("../controllers/users");
const {
  validateExistRole,
  validateExistEmail,
  validateExistUserById,
} = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");

const route = Router();

route.get("/", getUsers);

route.post(
  "/",
  [
    check("email", "The email is not valid").isEmail(),
    check("name", "The name is required").not().isEmpty(),
    check("password", "The password must be longer than 6 characters").isLength({ min: 7 }),
    // check("role", "The role entered is not allowed value").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("email").custom(validateExistEmail),
    check("role").custom(validateExistRole),
    validateFields,
  ],
  postUsers
);

route.put(
  "/:id",
  [
    check("id", "The ID is not valid").isMongoId(),
    check("id").custom(validateExistUserById),
    check("role").custom(validateExistRole),
    validateFields,
  ],
  putUsers
);

route.patch("/", patchUsers);

route.delete(
  "/:id",
  [
    check("id", "The ID is not valid").isMongoId(),
    check("id").custom(validateExistUserById),
    validateFields,
  ],
  deleteUsers
);

module.exports = route;

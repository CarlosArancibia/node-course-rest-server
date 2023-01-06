const { Router } = require("express");
const { check } = require("express-validator");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");
const { validateExistCategoryById } = require("../helpers/db-validators");

const route = Router();

// Get all categories - public
route.get("/", getCategories);

// Get a category by id - public
route.get(
  "/:id",
  [
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(validateExistCategoryById),
    validateFields,
  ],
  getCategory
);

// Create category - private - any user with a valid token
route.post(
  "/",
  [validateJWT, check("name", "The name is required").not().isEmpty(), validateFields],
  createCategory
);

// Update category - private - any user with a valid token
route.put(
  "/:id",
  [
    validateJWT,
    check("id", "The id is not valid").isMongoId(),
    check("name", "The name is required").not().isEmpty(),
    check("id").custom(validateExistCategoryById),
    validateFields,
  ],
  updateCategory
);

// Delete category - private - user with admin role
route.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(validateExistCategoryById),
    validateFields,
  ],
  deleteCategory
);

module.exports = route;

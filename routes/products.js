const { Router } = require("express");
const { check } = require("express-validator");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const { validateExistCategoryById, validateExistProductById } = require("../helpers/db-validators");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");

const route = Router();

route.get("/", getProducts);

route.get(
  "/:id",
  [
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(validateExistProductById),
    validateFields,
  ],
  getProduct
);

route.post(
  "/",
  [
    validateJWT,
    check("name", "The name is required").not().isEmpty(),
    check("category", "The Category Id is not valid").isMongoId(),
    check("category").custom(validateExistCategoryById),
    validateFields,
  ],
  createProduct
);

route.put(
  "/:id",
  [
    validateJWT,
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(validateExistProductById),
    // check("category", "The id is not valid").isMongoId(),
    // check("category").custom(validateExistCategoryById),
    validateFields,
  ],
  updateProduct
);

route.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "The id is not valid").isMongoId(),
    check("id").custom(validateExistProductById),
    validateFields,
  ],
  deleteProduct
);

module.exports = route;

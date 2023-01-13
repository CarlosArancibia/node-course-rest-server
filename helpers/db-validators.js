const { Role, Category, User } = require("../models");
const Product = require("../models/product");

const validateExistRole = async (role = "") => {
  const existRole = await Role.findOne({ role });
  if (!existRole) {
    throw new Error("The role entered is not allowed value");
  }
};

/**
 * Users
 */
const validateExistEmail = async (email = "") => {
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new Error("The email alredy exists");
  }
};

const validateExistUserById = async (id) => {
  const existUser = await User.findById(id);
  if (!existUser) {
    throw new Error("The user Id not exist");
  }
};

/**
 * Categories
 */
const validateExistCategoryById = async (id) => {
  const existCategory = await Category.findById(id);
  if (!existCategory) {
    throw new Error(`The category with Id ${id} doesn't exist`);
  }
};

/**
 * Products
 */
const validateExistProductById = async (id) => {
  const existProduct = await Product.findById(id);
  if (!existProduct) {
    throw new Error(`The product with Id ${id} doesn't exist`);
  }
};

/**
 * Uploads
 */
const validateAllowedCollections = (collection, allowedCollection = []) => {
  if (!allowedCollection.includes(collection)) {
    throw new Error(`The collection: ${collection} is not allowed`);
  }
  return true;
};

module.exports = {
  validateExistRole,
  validateExistEmail,
  validateExistUserById,
  validateExistCategoryById,
  validateExistProductById,
  validateAllowedCollections,
};

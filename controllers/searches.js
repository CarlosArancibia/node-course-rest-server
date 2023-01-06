const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const { User, Category, Product } = require("../models");

const collectionsAllowed = ["categories", "users", "products", "roles"];

const searchUser = async (term = "", res = response) => {
  const isMongoId = isValidObjectId(term);

  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const regEx = new RegExp(term, "i"); // Usamos una expresión regular para no discriminar entre mayus y minus

  const user = await User.find({
    $or: [{ name: regEx }, { email: regEx }],
    $and: [{ status: true }],
  });

  res.json({
    results: user,
  });
};

const searchCategory = async (term = "", res = response) => {
  if (isValidObjectId(term)) {
    const category = await Category.findById(term);

    return res.json({
      results: category ? [category] : [],
    });
  }

  const regEx = new RegExp(term, "i");

  const category = await Category.find({ name: regEx, status: true });

  res.json({
    results: category,
  });
};

const searchProduct = async (term = "", res = response) => {
  if (isValidObjectId(term)) {
    const product = await Product.findById(term).populate("category", "name");
    return res.json({
      results: product ? [product] : [],
    });
  }

  const regEx = new RegExp(term, "i");

  const product = await Product.find({ name: regEx, status: true }).populate("category", "name");

  res.json({
    results: product,
  });
};

const search = (req, res = response) => {
  const { collection, term } = req.params;

  if (!collectionsAllowed.includes(collection)) {
    return res.status(400).json({
      msg: `The collection entered is not among the allowed collections: ${collectionsAllowed}`,
    });
  }

  switch (collection) {
    case "categories":
      searchCategory(term, res);
      break;
    case "users":
      searchUser(term, res);
      break;
    case "products":
      searchProduct(term, res);
      break;

    default:
      res.status(500).json({
        msg: "Need to implement",
      });
      break;
  }
};

module.exports = {
  search,
};

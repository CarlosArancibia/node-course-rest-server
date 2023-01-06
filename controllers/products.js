const { response } = require("express");
const Product = require("../models/product");

const getProducts = async (req, res = response) => {
  const { since = 0, limit = 5 } = req.query;
  const query = { status: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("user", "name")
      .populate("category", "name")
      .skip(Number(since))
      .limit(Number(limit)),
  ]);

  res.json({ total, products });
};

const getProduct = async (req, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate("user", "name").populate("category", "name");

  if (!product.status) {
    return res.status(400).json({
      msg: "The product does not exist - status: false",
    });
  }

  res.json(product);
};

const createProduct = async (req, res = response) => {
  const { name, price, description, category } = req.body;

  const existProduct = await Product.findOne({ name });

  if (existProduct) {
    return res.status(400).json({
      msg: `The ${name} product alredy exists`,
    });
  }

  const data = {
    name: name.toUpperCase(),
    price,
    description,
    user: req.userAuth._id,
    category,
  };

  const product = new Product(data);
  await product.save();

  res.status(201).json({
    product,
  });
};

const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const { status, user, ...spare } = req.body;

  spare.user = req.userAuth._id;
  spare.name = spare.name.toUpperCase();

  const existProduct = await Product.findOne({ name: spare.name });

  if (existProduct) {
    return res.status(400).json({
      msg: "The product alredy exist",
    });
  }

  const product = await Product.findByIdAndUpdate(id, spare, { new: true })
    .populate("user", "name")
    .populate("category", "name");

  res.json(product);
};

const deleteProduct = async (req, res = response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

  res.json(product);
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

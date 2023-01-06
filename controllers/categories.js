const { response, request } = require("express");
const { Category } = require("../models");

const getCategories = async (req, res = response) => {
  const { since = 0, limit = 5 } = req.query;
  const query = { status: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query).populate("user", "name").skip(Number(since)).limit(Number(limit)),
  ]);

  res.json({
    total,
    categories,
  });
};

const getCategory = async (req, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("user", "name");

  if (!category.status) {
    return res.status(400).json({
      msg: "The category does not exist - status: false",
    });
  }

  res.json(category);
};

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  // Verify that the category exists
  const category = await Category.findOne({ name });

  // If exist return error
  if (category) {
    return res.status(400).json({
      msg: `The ${category.name} category alredy exists`,
    });
  }

  const data = {
    name,
    user: req.userAuth._id,
  };

  // Create Category Instance
  const newCategory = new Category(data);

  // Save instance in DB
  await newCategory.save();

  return res.status(201).json(newCategory);
};

const updateCategory = async (req, res = response) => {
  const { id } = req.params;
  const { _id, status, userAuth, ...spare } = req.body;

  spare.name = spare.name.toUpperCase();
  spare.user = req.userAuth._id;

  const category = await Category.findByIdAndUpdate(id, spare, { new: true }).populate("user", "name");

  res.json(category);
};

const deleteCategory = async (req, res = response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

  res.json(category);
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};

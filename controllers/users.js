const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const getUsers = async (req, res = response) => {
  // res.send("Hello World");

  const { since = 1, limit = 5 } = req.query;
  const query = { status: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(since)).limit(Number(limit)),
  ]);

  // const users = await User.find(query).skip(Number(since)).limit(Number(limit));
  // const total = await User.countDocuments(query);

  res.json({
    message: "get api - controller",
    limit,
    since,
    total,
    users,
  });
};

const postUsers = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Encrypt password
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(user.password, salt);

  await user.save();

  res.status(201).json({
    user,
  });
};

const putUsers = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...spare } = req.body;

  // Update user password
  if (password) {
    // Encrypt password
    const salt = bcrypt.genSaltSync();
    spare.password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, spare);

  res.json(user);
};

const patchUsers = (req, res = response) => {
  res.json({
    message: "patch api - controller",
  });
};

const deleteUsers = async (req, res = response) => {
  const { id } = req.params;

  // const user = await User.findByIdAndDelete(id); // Hard Delete (Borra incluso en la base) No recomendado.
  const user = await User.findByIdAndUpdate(id, { status: false });

  res.json({
    message: "delete api - controller",
    user,
  });
};

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
};

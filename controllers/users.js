const { response, request } = require("express");

const getUsers = (req, res = response) => {
  // res.send("Hello World");

  const { name, page = "1" } = req.query;

  res.json({
    message: "get api - controller",
    name,
    page,
  });
};

const postUsers = (req, res = response) => {
  const { name, age } = req.body;

  res.status(201).json({
    message: "post api - controller",
    name,
    age,
  });
};

const putUsers = (req = request, res = response) => {
  const { id } = req.params;

  res.json({
    message: "put api - controller",
    id,
  });
};

const patchUsers = (req, res = response) => {
  res.json({
    message: "patch api - controller",
  });
};
const deleteUsers = (req, res = response) => {
  const { id } = req.params;

  res.json({
    message: "delete api - controller",
    id,
  });
};

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
};

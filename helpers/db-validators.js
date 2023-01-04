const Role = require("../models/role");
const User = require("../models/user");

const validateExistRole = async (role = "") => {
  const existRole = await Role.findOne({ role });
  if (!existRole) {
    throw new Error("The role entered is not allowed value");
  }
};

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

module.exports = {
  validateExistRole,
  validateExistEmail,
  validateExistUserById,
};

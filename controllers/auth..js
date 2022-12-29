const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const generateJWT = require("../helpers/generate-jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Validate user exist
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "User/password are not valid - email",
      });
    }

    // Validate user is active
    if (!user.status) {
      return res.status(400).json({
        msg: "User/password are not valid - status: false",
      });
    }

    // Match password
    const isPasswordValid = bcryptjs.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        msg: "User/password are not valid - password",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      msg: "login OK",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "An error has ocurred, talk to the administrator",
    });
  }
};

module.exports = {
  login,
};

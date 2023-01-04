const { response, request } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const generateJWT = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleAuth = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, img, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });
    console.log(user);

    // If the user doesn't exist
    if (!user) {
      // I have to create it
      const data = {
        name,
        email,
        password: ":P",
        img,
        google: true,
        role: "USER_ROLE",
      };
      user = new User(data);
      await user.save();
    }

    // If the user exist in DB, verify status
    if (!user.status) {
      return res.status(401).json({
        msg: "Blocked user, talk to the administrator please",
      });
    }

    // Generate Token: JWT
    const token = await generateJWT(user.id);

    return res.json({
      msg: "Ok! Google Sign-in",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Could not verify token",
    });
  }
};

module.exports = {
  login,
  googleAuth,
};
